// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SplashIDL from '../target/idl/splash.json'
import type { Splash } from '../target/types/splash'

// Re-export the generated IDL and type
export { Splash, SplashIDL }

// The programId is imported from the program IDL.
export const SPLASH_PROGRAM_ID = new PublicKey(SplashIDL.address)

// This is a helper function to get the Splash Anchor program.
export function getSplashProgram(provider: AnchorProvider) {
  return new Program(SplashIDL as Splash, provider)
}

// This is a helper function to get the program ID for the Splash program depending on the cluster.
export function getSplashProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Splash program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return SPLASH_PROGRAM_ID
  }
}
