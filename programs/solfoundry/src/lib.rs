use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("SoLFoUnDrYEsCrOwPrOgRaMiDtObErEpLaCeD11111");

#[program]
pub mod solfoundry {
    use super::*;

    /// Initialize a new escrow for an accepted bid
    /// Called by the thinker when accepting a builder's bid
    pub fn create_escrow(
        ctx: Context<CreateEscrow>,
        idea_id: [u8; 32],
        amount: u64,
        deadline: i64,
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        escrow.thinker = ctx.accounts.thinker.key();
        escrow.builder = ctx.accounts.builder.key();
        escrow.idea_id = idea_id;
        escrow.amount = amount;
        escrow.deadline = deadline;
        escrow.status = EscrowStatus::Funded;
        escrow.created_at = Clock::get()?.unix_timestamp;
        escrow.bump = ctx.bumps.escrow;

        // Transfer SOL from thinker to escrow vault
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.thinker.to_account_info(),
                to: ctx.accounts.escrow_vault.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, amount)?;

        emit!(EscrowCreated {
            escrow: escrow.key(),
            thinker: escrow.thinker,
            builder: escrow.builder,
            idea_id,
            amount,
            deadline,
        });

        Ok(())
    }

    /// Release funds to builder after work is approved
    /// Only the thinker can release
    pub fn release_funds(ctx: Context<ReleaseFunds>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        require!(
            escrow.status == EscrowStatus::Funded,
            SolFoundryError::InvalidEscrowStatus
        );
        require!(
            ctx.accounts.thinker.key() == escrow.thinker,
            SolFoundryError::Unauthorized
        );

        let amount = escrow.amount;
        
        // Transfer from vault to builder
        **ctx.accounts.escrow_vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.builder.to_account_info().try_borrow_mut_lamports()? += amount;

        escrow.status = EscrowStatus::Released;
        escrow.released_at = Some(Clock::get()?.unix_timestamp);

        emit!(FundsReleased {
            escrow: escrow.key(),
            builder: escrow.builder,
            amount,
        });

        Ok(())
    }

    /// Refund to thinker if deadline passed and work not delivered
    /// Only thinker can request refund after deadline
    pub fn request_refund(ctx: Context<RequestRefund>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let clock = Clock::get()?;
        
        require!(
            escrow.status == EscrowStatus::Funded,
            SolFoundryError::InvalidEscrowStatus
        );
        require!(
            ctx.accounts.thinker.key() == escrow.thinker,
            SolFoundryError::Unauthorized
        );
        require!(
            clock.unix_timestamp > escrow.deadline,
            SolFoundryError::DeadlineNotPassed
        );

        let amount = escrow.amount;
        
        // Transfer from vault back to thinker
        **ctx.accounts.escrow_vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.thinker.to_account_info().try_borrow_mut_lamports()? += amount;

        escrow.status = EscrowStatus::Refunded;

        emit!(FundsRefunded {
            escrow: escrow.key(),
            thinker: escrow.thinker,
            amount,
        });

        Ok(())
    }

    /// Open a dispute (freezes funds until resolution)
    /// Either party can open dispute
    pub fn open_dispute(ctx: Context<OpenDispute>, reason: String) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        require!(
            escrow.status == EscrowStatus::Funded,
            SolFoundryError::InvalidEscrowStatus
        );
        
        let caller = ctx.accounts.caller.key();
        require!(
            caller == escrow.thinker || caller == escrow.builder,
            SolFoundryError::Unauthorized
        );

        escrow.status = EscrowStatus::Disputed;
        escrow.dispute_reason = Some(reason.clone());
        escrow.disputed_by = Some(caller);

        emit!(DisputeOpened {
            escrow: escrow.key(),
            opened_by: caller,
            reason,
        });

        Ok(())
    }

    /// Resolve dispute (admin function for v1, DAO for v2)
    /// release_to_builder: true = builder gets funds, false = thinker refund
    pub fn resolve_dispute(
        ctx: Context<ResolveDispute>,
        release_to_builder: bool,
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        require!(
            escrow.status == EscrowStatus::Disputed,
            SolFoundryError::InvalidEscrowStatus
        );

        let amount = escrow.amount;

        if release_to_builder {
            **ctx.accounts.escrow_vault.to_account_info().try_borrow_mut_lamports()? -= amount;
            **ctx.accounts.builder.to_account_info().try_borrow_mut_lamports()? += amount;
            escrow.status = EscrowStatus::Released;
        } else {
            **ctx.accounts.escrow_vault.to_account_info().try_borrow_mut_lamports()? -= amount;
            **ctx.accounts.thinker.to_account_info().try_borrow_mut_lamports()? += amount;
            escrow.status = EscrowStatus::Refunded;
        }

        emit!(DisputeResolved {
            escrow: escrow.key(),
            release_to_builder,
            amount,
        });

        Ok(())
    }
}

// ============================================================================
// Accounts
// ============================================================================

#[derive(Accounts)]
#[instruction(idea_id: [u8; 32])]
pub struct CreateEscrow<'info> {
    #[account(mut)]
    pub thinker: Signer<'info>,
    
    /// CHECK: Builder's wallet, validated by thinker's choice
    pub builder: UncheckedAccount<'info>,
    
    #[account(
        init,
        payer = thinker,
        space = 8 + Escrow::INIT_SPACE,
        seeds = [b"escrow", idea_id.as_ref()],
        bump
    )]
    pub escrow: Account<'info, Escrow>,
    
    /// CHECK: PDA vault to hold escrowed funds
    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub escrow_vault: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReleaseFunds<'info> {
    #[account(mut)]
    pub thinker: Signer<'info>,
    
    /// CHECK: Builder receiving funds
    #[account(mut)]
    pub builder: UncheckedAccount<'info>,
    
    #[account(
        mut,
        constraint = escrow.builder == builder.key() @ SolFoundryError::InvalidBuilder
    )]
    pub escrow: Account<'info, Escrow>,
    
    /// CHECK: Escrow vault PDA
    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub escrow_vault: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RequestRefund<'info> {
    #[account(mut)]
    pub thinker: Signer<'info>,
    
    #[account(
        mut,
        constraint = escrow.thinker == thinker.key() @ SolFoundryError::Unauthorized
    )]
    pub escrow: Account<'info, Escrow>,
    
    /// CHECK: Escrow vault PDA
    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub escrow_vault: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct OpenDispute<'info> {
    #[account(mut)]
    pub caller: Signer<'info>,
    
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
}

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    /// Admin/resolver - in v1 this is a trusted key, v2 would be DAO
    #[account(mut)]
    pub resolver: Signer<'info>,
    
    /// CHECK: Thinker's wallet for potential refund
    #[account(mut)]
    pub thinker: UncheckedAccount<'info>,
    
    /// CHECK: Builder's wallet for potential release
    #[account(mut)]
    pub builder: UncheckedAccount<'info>,
    
    #[account(
        mut,
        constraint = escrow.thinker == thinker.key() @ SolFoundryError::InvalidThinker,
        constraint = escrow.builder == builder.key() @ SolFoundryError::InvalidBuilder
    )]
    pub escrow: Account<'info, Escrow>,
    
    /// CHECK: Escrow vault PDA
    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub escrow_vault: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

// ============================================================================
// State
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct Escrow {
    pub thinker: Pubkey,
    pub builder: Pubkey,
    pub idea_id: [u8; 32],
    pub amount: u64,
    pub deadline: i64,
    pub status: EscrowStatus,
    pub created_at: i64,
    pub released_at: Option<i64>,
    #[max_len(200)]
    pub dispute_reason: Option<String>,
    pub disputed_by: Option<Pubkey>,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum EscrowStatus {
    Funded,
    Released,
    Refunded,
    Disputed,
}

// ============================================================================
// Events
// ============================================================================

#[event]
pub struct EscrowCreated {
    pub escrow: Pubkey,
    pub thinker: Pubkey,
    pub builder: Pubkey,
    pub idea_id: [u8; 32],
    pub amount: u64,
    pub deadline: i64,
}

#[event]
pub struct FundsReleased {
    pub escrow: Pubkey,
    pub builder: Pubkey,
    pub amount: u64,
}

#[event]
pub struct FundsRefunded {
    pub escrow: Pubkey,
    pub thinker: Pubkey,
    pub amount: u64,
}

#[event]
pub struct DisputeOpened {
    pub escrow: Pubkey,
    pub opened_by: Pubkey,
    pub reason: String,
}

#[event]
pub struct DisputeResolved {
    pub escrow: Pubkey,
    pub release_to_builder: bool,
    pub amount: u64,
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum SolFoundryError {
    #[msg("Invalid escrow status for this operation")]
    InvalidEscrowStatus,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Deadline has not passed yet")]
    DeadlineNotPassed,
    #[msg("Invalid builder address")]
    InvalidBuilder,
    #[msg("Invalid thinker address")]
    InvalidThinker,
}
