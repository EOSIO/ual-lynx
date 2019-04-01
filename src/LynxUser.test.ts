import { Chain, RpcEndpoint, UALErrorType } from 'universal-authenticator-library'
import { AccountJSON } from './fixtures/accountJSON'
import { Name } from './interfaces'
import { LynxUser } from './LynxUser'
import { UALLynxError } from './UALLynxError'

declare var window: any

const accountObj = JSON.parse(AccountJSON)

const endpoint: RpcEndpoint = {
  protocol: 'https',
  host: 'example.com',
  port: 443,
}

const chain: Chain = {
  chainId: '1234567890',
  rpcEndpoints: [endpoint]
}

// Cannot directly set window.navigator.userAgent - no setter, only a getter
// So turn userAgent into a writable property
function makeUserAgentMutable() {
  const userAgentProp = {
    value: 'default',
    writable: true,
  }
  Object.defineProperty(window.navigator, 'userAgent', userAgentProp)
}

describe('LynxUser', () => {
  let user: LynxUser

  beforeAll(() => {
    makeUserAgentMutable()
  })

  beforeEach(() => {
    user = new LynxUser(chain, accountObj)
  })

  it('gets the account name', async () => {
    const accountName = await user.getAccountName()
    expect(accountName).toEqual('testtesttest')
  })

  it('get the keys', async () => {
    const activeKeys = ['EOS11111']
    const keys = await user.getKeys()
    expect(keys).toEqual(activeKeys)
  })

  it('gets the chain ID', async () => {
    const chainId = await user.getChainId()
    expect(chainId).toEqual(chain.chainId)
  })

  describe('signArbitrary', () => {
    it('throws UALError if not iOS', async () => {
      const requestArbitrarySignature = jest.fn()
      window.lynxMobile = {
        requestArbitrarySignature
      }
      window.navigator.userAgent = 'EOSLynx Android'
      let didThrow = true

      try {
        await user.signArbitrary('myPublicKey', 'This should be signed', 'Some help text')
        didThrow = false
      } catch (e) {
        const ex = e as UALLynxError
        expect(ex.message).toEqual('Arbitrary data signing is only support on iOS')
        expect(ex.source).toEqual(Name)
        expect(ex.type).toEqual(UALErrorType.Signing)
        expect(ex.cause).toBeNull()
      }

      expect(didThrow).toBe(true)
    })

    it('throws UALError on api error', async () => {
      const errorMsg = 'Error signing arbitrary data'
      const requestArbitrarySignature = jest
        .fn()
        .mockImplementation(() => {
          throw new Error(errorMsg)
        })
      window.lynxMobile = {
        requestArbitrarySignature
      }
      window.navigator.userAgent = 'EOSLynx IOS'
      let didThrow = true

      try {
        await user.signArbitrary('myPublicKey', 'This should be signed', 'Some help text')
        didThrow = false
      } catch (e) {
        const ex = e as UALLynxError
        expect(ex.message).toEqual('Unable to sign arbitrary string')
        expect(ex.source).toEqual(Name)
        expect(ex.type).toEqual(UALErrorType.Signing)
        expect(ex.cause).toEqual(new Error(errorMsg))
      }

      expect(didThrow).toBe(true)
    })

    it('signs arbitrary data', async () => {
      const expectedSignature = 'sig1234567890'
      const requestArbitrarySignature = jest
        .fn()
        .mockImplementation(() => {
          return expectedSignature
        })
      window.lynxMobile = {
        requestArbitrarySignature
      }
      window.navigator.userAgent = 'EOSLynx IOS'

      const signature = await user.signArbitrary('myPublicKey', 'This should be signed', 'Some help text')

      expect(signature).toEqual(expectedSignature)
    })
  })

  describe('signTransaction', () => {
    it('throws UALError on failed signTransaction', async () => {
      const transact = jest
        .fn()
        .mockImplementation(() => {
          throw new Error('Unable to transact')
        })
      window.lynxMobile = {
        transact
      }
      let didThrow = true

      try {
        await user.signTransaction({}, {})
        didThrow = false
      } catch (e) {
        const ex = e as UALLynxError
        expect(ex.source).toEqual(Name)
        expect(ex.type).toEqual(UALErrorType.Signing)
        expect(ex.cause).not.toBeNull()
      }

      expect(didThrow).toBe(true)
    })

    it('signs the transaction', async () => {
      const transactionId = 'id1234567890'
      const transact = jest
        .fn()
        .mockImplementation(() => {
          return { transaction_id: transactionId}
        })
      window.lynxMobile = {
        transact
      }
      const result = await user.signTransaction({}, {})
      expect(result.wasBroadcast).toBe(true)
      expect(result.transactionId).toEqual(transactionId)
    })
  })
})
