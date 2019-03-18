import {
  Authenticator,
  ButtonStyle,
  Chain,
  UALError,
  UALErrorType,
  User
} from '@blockone/universal-authenticator-library'
import { Name } from './interfaces'
import { lynxLogo } from './lynxLogo'
import { LynxUser } from './LynxUser'
import { UALLynxError } from './UALLynxError'

declare var window: any

export class Lynx extends Authenticator {
  // Interval to test for whether the Lynx API has attached to the window
  private static API_LOADED_CHECK_INTERVAL = 500
  // Number of times to look for the Lynx API before giving up
  private static NUM_CHECKS = 10
  private users: LynxUser[] = []
  private lynxIsLoading: boolean = true
  private initError: UALError | null = null

  private readonly supportedChains = {
    // Lynx only supports mainnet
    aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906: {},
  }

  /**
   * Lynx Constructor
   * @param chains
   */
  constructor(chains: Chain[]) {
    super(chains)
  }

  private isLynxReady(): Promise<boolean> {
    return new Promise((resolve) => {
      let checkCount = Lynx.NUM_CHECKS
      const checkInterval = setInterval(() => {
        if (!!window.lynxMobile || checkCount === 0) {
          clearInterval(checkInterval)
          resolve(!!window.lynxMobile)
        }
        checkCount--
      }, Lynx.API_LOADED_CHECK_INTERVAL)
    })
  }

  private supportsAllChains(): boolean {
    if (this.chains.length < 1) {
      return false
    }

    for (const chain of this.chains) {
      if (!this.supportedChains.hasOwnProperty(chain.chainId)) {
        return false
      }
    }

    return true
  }

  /**
   * Lynx injects into the app from its internal browser, because of that we check on a
   * configured interval, allowing up to 5 seconds for Lynx to become available before
   * throwing an initialization error.
   */
  public async init() {
    this.lynxIsLoading = true
    try {
      let lynxReady = await this.isLynxReady()
      if (!lynxReady) {
        throw new Error('Unable to connect')
      }
    } catch (e) {
      this.initError = new UALLynxError(
        'Error occurred during autologin',
        UALErrorType.Initialization,
        e)
    } finally {
      this.lynxIsLoading = false
    }
  }

  public reset(): void {
    this.initError = null
    this.init()
  }

  public getStyle(): ButtonStyle {
    return {
      icon: lynxLogo,
      text: Name,
      textColor: 'white',
      background: '#AF3863'
    }
  }

  /**
   * Lynx is chain and environment specific, it will only load within the Lynx browser
   * provided all chains are supported.
   */
  public shouldRender(): boolean {
    if (this.supportsAllChains()) {
      return true
    }

    return false
  }

  public shouldAutoLogin(): boolean {
    // Always autologin if should render, since that should only be inside the Lynx browser
    return this.shouldRender()
  }

  /**
   * Requests the currently active account from Lynx, will throw a Login error if Lynx does
   * not respond or errors out
   */
  public async login(_?: string): Promise<User[]> {
    if (this.users.length === 0) {
      try {
        const account = await window.lynxMobile.requestSetAccount()
        this.users.push(new LynxUser(this.chains[0], account))
      } catch (e) {
        throw new UALLynxError(
          'Unable to get the current account during login',
          UALErrorType.Login,
          e)
      }
    }

    return this.users
  }

  /**
   * Clears the array of authenticated users
   * Note: The name - logout - is slightly misleading in this particular case
   * as calling this method will not log a user out of the Lynx app but rather
   * refresh the user list on the authenticator
   */
  public async logout(): Promise<void> {
    this.users = []
  }

  public async shouldRequestAccountName(): Promise<boolean> {
    return false
  }

  public isLoading(): boolean {
    return this.lynxIsLoading
  }

  public isErrored(): boolean {
    return !!this.initError
  }

  public getError(): UALError | null {
    return this.initError
  }

  public getOnboardingLink(): string {
    return 'https://eoslynx.com/'
  }

  public requiresGetKeyConfirmation(): boolean {
    return false
  }
}
