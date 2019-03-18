import {
  Chain,
  SignTransactionConfig,
  SignTransactionResponse,
  UALErrorType,
  User
} from '@blockone/universal-authenticator-library'
import { UALLynxError } from './UALLynxError'

declare var window: any

export class LynxUser extends User {
  private account: any
  private keys: string[] = []
  private chainId = ''

  constructor(
    chain: Chain | null,
    accountObj: any
  ) {
    super()
    this.account = accountObj.account

    if (chain && chain.chainId) {
      this.chainId = chain.chainId
    }
  }

  public async signTransaction(
    transaction: any,
    // tslint:disable-next-line:variable-name
    _config: SignTransactionConfig
  ): Promise<SignTransactionResponse> {
    let result

    try {
      result = await window.lynxMobile.transact(transaction)

      return {
        wasBroadcast: true,
        transactionId: result.transaction_id,
        transaction: result,
      }
    } catch (e) {
      throw new UALLynxError(
        'Unable to sign the given transaction',
        UALErrorType.Signing,
        e)
    }
  }

  public async signArbitrary(_: string, data: string, helpText: string): Promise<string> {
    if (this.isIOS()) {
      try {
        return window.lynxMobile.requestArbitrarySignature({data, whatFor: helpText})
      } catch (e) {
        throw new UALLynxError(
          'Unable to sign arbitrary string',
          UALErrorType.Signing,
          e
        )
      }
    } else {
      throw new UALLynxError(
        'Arbitrary data signing is only support on iOS',
        UALErrorType.Signing,
        null
      )
    }
  }

  public async verifyKeyOwnership(_: string): Promise<boolean> {
    throw new Error('Lynx does not currently support verifyKeyOwnership')
  }

  public async getAccountName(): Promise<string> {
    return this.account.account_name
  }

  public async getChainId(): Promise<string> {
    return this.chainId
  }

  public async getKeys(): Promise<string[]> {
    if (this.keys.length === 0) {
      this.account.permissions.forEach((perm: any) => {
        if (perm.perm_name === 'active') {
          perm.required_auth.keys.forEach((key: any) => {
            this.keys.push(key.key)
          })
        }
      })
    }

    return this.keys
  }

  private isIOS(): boolean {
    const userAgent = window.navigator.userAgent
    return userAgent === 'EOSLynx IOS'
  }
}
