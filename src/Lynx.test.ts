import { Chain, RpcEndpoint, UALErrorType } from '@blockone/universal-authenticator-library'
import { AccountJSON } from './fixtures/accountJSON'
import { Name } from './interfaces'
import { Lynx } from './Lynx'
import { UALLynxError } from './UALLynxError'

declare var window: any

jest.useFakeTimers()

const accountObj = JSON.parse(AccountJSON)

describe('Lynx', () => {
  let lynxMobile: any

  beforeEach(() => {
    const requestSetAccount = jest
      .fn()
      .mockReturnValue(accountObj)

    const lynxMobileMock = {
      requestSetAccount
    }

    lynxMobile = lynxMobileMock
  })

  describe('init', () => {
    it('loading should be false if Lynx is not loaded', () => {
      window.lynxMobile = null
      const lynx = new Lynx([] as Chain[])
      lynx.init()
      .then(() => {
        // Make the API available after 0.5 sec
        jest.advanceTimersByTime(500)
        window.lynxMobile = lynxMobile
        // Run timers to completion
        jest.runAllTimers()
        expect(lynx.isLoading()).toBe(false)
      })
    })

    it('loading should be true if Lynx is not loaded', () => {
      window.lynxMobile = null
      const lynx = new Lynx([] as Chain[])
      lynx.init()
      jest.runAllTimers()
      expect(lynx.isLoading()).toBe(true)
    })
  })

  describe('shouldRender', () => {
    it('should return false if a given chain is not supported', () => {
      window.lynxMobile = lynxMobile
      const chains = [
        {
          chainId: '687fa513e18843ad3e820744f4ffcf93k1354036d80737db8dc444fe4m15ad17',
          rpcEndpoints: [] as RpcEndpoint[]
        },
        {
          chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
          rpcEndpoints: [] as RpcEndpoint[]
        }
      ]
      const lynx = new Lynx(chains)
      const shouldRender = lynx.shouldRender()
      jest.runAllTimers()
      expect(shouldRender).toBe(false)
    })

    it('should return true if all given chains are supported', () => {
      window.lynxMobile = lynxMobile
      const chains = [
        {
          chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
          rpcEndpoints: [] as RpcEndpoint[]
        }
      ]
      const lynx = new Lynx(chains)
      const shouldRender = lynx.shouldRender()
      jest.runAllTimers()
      expect(shouldRender).toBe(true)
    })
  })

  describe('login', () => {
    it('should get the accounts', async () => {
      window.lynxMobile = lynxMobile
      const lynx = new Lynx([] as Chain[])
      const accounts = await lynx.login()
      expect(accounts.length).toBe(1)
      const accountName = await accounts[0].getAccountName()
      expect(accountName).toBe('testtesttest')
    })

    it('should throw exception on error', async () => {
      lynxMobile.requestSetAccount = jest
        .fn()
        .mockImplementation(() => {
          throw new Error('Unable to login')
        })
      window.lynxMobile = lynxMobile
      const lynx = new Lynx([] as Chain[])
      let didThrow = true

      try {
        await lynx.login()
        didThrow = false
      } catch (e) {
        const ex = e as UALLynxError
        expect(ex.source).toEqual(Name)
        expect(ex.type).toEqual(UALErrorType.Login)
        expect(ex.cause).not.toBeNull()
      }

      expect(didThrow).toBe(true)
    })
  })

  describe('isLoading', () => {
    it('defaults to true when the authenticator is not initialized', () => {
      window.lynxMobile = null
      const lynx = new Lynx([] as Chain[])

      expect(lynx.isLoading()).toBe(true)
    })

    it('is true while authenticator is initializing, and transitions when done', () => {
      window.lynxMobile = null
      const lynx = new Lynx([] as Chain[])
      lynx.init()
      .then(() => {
        // Make the API available after 0.5 sec
        jest.advanceTimersByTime(500)
        window.lynxMobile = lynxMobile
        // Run timers to completion
        jest.runAllTimers()
        expect(lynx.isLoading()).toBe(false)
      })
    })
  })
})
