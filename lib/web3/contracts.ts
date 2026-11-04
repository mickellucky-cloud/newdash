export const CONTRACT_ADDRESSES = {
  // BSC Testnet
  bscTestnet: {
    oknToken: '0x9482Ac05510E59d9c8C636b0D4A0c128D3D9E9E9' as `0x${string}`,
    tokenSale: '0x43868B750eA3B310F0606B8F7792e3B80678F128' as `0x${string}`,
    merkleDistributor: '0xE2547eB8468b1a3B770F73356064D3B0387532A0' as `0x${string}`,
  },
  // BSC Mainnet
  bsc: {
    oknToken: '0x32A4fC537B47C9E5497Bce2E6Fe9b63435B4D2A9' as `0x${string}`,
    tokenSale: '0x1C250882e9894e101968874Fe585a968652D1234' as `0x${string}`,
    merkleDistributor: '0x7e88c751296D468502A197D87b22F1e564B59821' as `0x${string}`,
  },
};

export const OKN_TOKEN_ABI = [
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export const TOKEN_SALE_ABI = [
  {
    name: 'buyTokens',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ name: 'recipient', type: 'address' }],
    outputs: [{ name: 'tokensBought', type: 'uint256' }],
  },
  {
    name: 'rate',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'tokenPriceBNB',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'totalRaisedBNB',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export const MERKLE_DISTRIBUTOR_ABI = [
  {
    name: 'claim',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'index', type: 'uint256' },
      { name: 'account', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'merkleProof', type: 'bytes32[]' },
    ],
    outputs: [],
  },
  {
    name: 'isClaimed',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'index', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'merkleRoot',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32' }],
  },
] as const;

export const OKN_RATE = 10000; // 1 BNB = 10,000 $OKN
export const OKN_PRICE_USD = 0.065;
export const BNB_PRICE_USD = 650.0;
