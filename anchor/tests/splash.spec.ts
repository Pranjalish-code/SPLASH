import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Splash} from '../target/types/splash'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
import { randomUUID } from 'crypto'
const IDL = require('../target/idl/splash.json')
const campaign_address = new PublicKey("7qpRXNFY5PJQfwptK4BosJ5jCnVeEYRWATFu8BBDTVcr")

describe('splash', () => {
  // Configure the client to use the local cluster.
  // const provider = anchor.AnchorProvider.env()
  // anchor.setProvider(provider)
  // const payer = provider.wallet as anchor.Wallet

  // const program = anchor.workspace.Dashh as Program<Dashh>

  const splashkeypair = Keypair.generate()
  let context;
let provider;
let splashProgram: Program<Splash>;
  beforeAll(async () => {
     context = await startAnchor("", [{
      name: "splash",
      programId: campaign_address,
    }], []);
	 provider = new BankrunProvider(context);
splashProgram = new Program<Splash>(IDL, provider);

});


const id = new anchor.BN(randomUUID().split("-").join("").slice(0, 8), 16);
it('Initialize campaign', async () => {
await splashProgram.methods.createCampaign(
  id,
  "Test knowflow",
  "https://images.unsplash.com/photo-1719937206667-ac87c15ad3e9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "this is only for testing in and out",
"0x0",
new anchor.BN(1832639258),
new anchor.BN(1000),
).rpc();

const [campaignAddress]=PublicKey.findProgramAddressSync([id.toArrayLike(Buffer, 'le', 8)],campaign_address);

const campaign = await splashProgram.account.campaign.fetch(campaignAddress);
console.log("campaign", campaign);

// expect(campaign.campaignId.toNumber()).toEqual(1);
// expect(campaign.description).toEqual("What is your favorite color?");
// expect(campaign.campaignSatrt.toNumber()).toBeLessThan(campaign.campaignEnd.toNumber())

})



it('participate in campaign', async () => {
  
  await splashProgram.methods.createParticipent(
    id,
    splashKeypair.publicKey,
  ).rpc();
  
  const [participantAddress]=PublicKey.findProgramAddressSync([id.toArrayLike(Buffer, 'le', 8),splashKeypair.publicKey.toBuffer()],campaign_address);
  
  const participant = await splashProgram.account.participent.fetch(participantAddress);
  console.log("participant", participant);
  
  // expect(campaign.campaignId.toNumber()).toEqual(1);
  // expect(campaign.description).toEqual("What is your favorite color?");
  // expect(campaign.campaignSatrt.toNumber()).toBeLessThan(campaign.campaignEnd.toNumber())
  
  })

  it('updates in participant', async () => {
    await splashProgram.methods.updatedParticipent(
      id,
      splashKeypair.publicKey,
      new anchor.BN(100),
    ).rpc();
    
    const [participantAddress]=PublicKey.findProgramAddressSync([id.toArrayLike(Buffer, 'le', 8),splashKeypair.publicKey.toBuffer()],campaign_address);
    
    const participant = await splashProgram.account.participent.fetch(participantAddress);
    console.log("participant", participant);
    console.log("points", participant.points.toNumber());
    expect(participant.points.toNumber()).toEqual(100);
    // expect(campaign.campaignId.toNumber()).toEqual(1);
    // expect(campaign.description).toEqual("What is your favorite color?");
    // expect(campaign.campaignSatrt.toNumber()).toBeLessThan(campaign.campaignEnd.toNumber())
    
    })

  
})
