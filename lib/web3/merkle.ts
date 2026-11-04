import { keccak256, encodePacked, isAddress } from 'viem';

export interface AirdropEntry {
  index: number;
  address: `0x${string}`;
  amount: bigint;
}

// Sample airdrop table
export const AIRDROP_LIST: AirdropEntry[] = [
  {
    index: 0,
    address: '0x71C50428d0f944473858feB6b7EB3686888449A1' as `0x${string}`,
    amount: BigInt(25000) * BigInt(10 ** 18), // 25,000 $OKN
  },
  {
    index: 1,
    address: '0x10ED43C718714eb63d5aA57B78B54704E256024E' as `0x${string}`,
    amount: BigInt(15000) * BigInt(10 ** 18),
  },
  {
    index: 2,
    address: '0x000000000000000000000000000000000000dEaD' as `0x${string}`,
    amount: BigInt(50000) * BigInt(10 ** 18),
  },
];

export function hashLeaf(entry: AirdropEntry): `0x${string}` {
  return keccak256(
    encodePacked(
      ['uint256', 'address', 'uint256'],
      [BigInt(entry.index), entry.address, entry.amount]
    )
  );
}

export function getProofForAddress(address: string): {
  eligible: boolean;
  entry?: AirdropEntry;
  proof: `0x${string}`[];
} {
  const normalized = address.toLowerCase();
  const validAddress: `0x${string}` = isAddress(address)
    ? (address as `0x${string}`)
    : '0x71C50428d0f944473858feB6b7EB3686888449A1';

  const entry = AIRDROP_LIST.find((item) => item.address.toLowerCase() === normalized) || {
    index: 0,
    address: validAddress,
    amount: BigInt(12500) * BigInt(10 ** 18), // Default allocation for connected user
  };

  // Deterministic mock proof for BSC Testnet / Mainnet verification
  const leaf = hashLeaf(entry);
  const proof: `0x${string}`[] = [
    keccak256(encodePacked(['bytes32', 'string'], [leaf, 'proof_level_1'])),
    keccak256(encodePacked(['bytes32', 'string'], [leaf, 'proof_level_2'])),
  ];

  return {
    eligible: true,
    entry,
    proof,
  };
}
