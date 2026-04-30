import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solfoundry } from "../target/types/solfoundry";
import { expect } from "chai";
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import crypto from "crypto";

describe("solfoundry", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Solfoundry as Program<Solfoundry>;
  
  const thinker = Keypair.generate();
  const builder = Keypair.generate();
  
  // Generate a unique idea ID
  const ideaId = crypto.randomBytes(32);
  
  let escrowPda: PublicKey;
  let vaultPda: PublicKey;

  before(async () => {
    // Airdrop SOL to thinker for testing
    const sig = await provider.connection.requestAirdrop(
      thinker.publicKey,
      10 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);

    // Derive PDAs
    [escrowPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), ideaId],
      program.programId
    );
    
    [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), escrowPda.toBuffer()],
      program.programId
    );
  });

  it("creates an escrow", async () => {
    const amount = new anchor.BN(1 * LAMPORTS_PER_SOL);
    const deadline = new anchor.BN(Math.floor(Date.now() / 1000) + 86400); // 24h from now

    await program.methods
      .createEscrow([...ideaId], amount, deadline)
      .accounts({
        thinker: thinker.publicKey,
        builder: builder.publicKey,
        escrow: escrowPda,
        escrowVault: vaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([thinker])
      .rpc();

    const escrow = await program.account.escrow.fetch(escrowPda);
    
    expect(escrow.thinker.toString()).to.equal(thinker.publicKey.toString());
    expect(escrow.builder.toString()).to.equal(builder.publicKey.toString());
    expect(escrow.amount.toNumber()).to.equal(amount.toNumber());
    expect(escrow.status).to.deep.equal({ funded: {} });
  });

  it("releases funds to builder", async () => {
    const builderBalanceBefore = await provider.connection.getBalance(builder.publicKey);

    await program.methods
      .releaseFunds()
      .accounts({
        thinker: thinker.publicKey,
        builder: builder.publicKey,
        escrow: escrowPda,
        escrowVault: vaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([thinker])
      .rpc();

    const escrow = await program.account.escrow.fetch(escrowPda);
    const builderBalanceAfter = await provider.connection.getBalance(builder.publicKey);

    expect(escrow.status).to.deep.equal({ released: {} });
    expect(builderBalanceAfter).to.be.greaterThan(builderBalanceBefore);
  });

  // Add more tests for refund, dispute, etc.
});
