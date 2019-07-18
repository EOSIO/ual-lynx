# UAL for Lynx Authenticator

This authenticator is meant to be used with [Universal Authenticator Library](https://github.com/EOSIO/universal-authenticator-library)

![EOSIO Labs](https://img.shields.io/badge/EOSIO-Labs-5cb3ff.svg)

# About EOSIO Labs

EOSIO Labs repositories are experimental.  Developers in the community are encouraged to use EOSIO Labs repositories as the basis for code and concepts to incorporate into their applications. Community members are also welcome to contribute and further develop these repositories. Since these repositories are not supported by Block.one, we may not provide responses to issue reports, pull requests, updates to functionality, or other requests from the community, and we encourage the community to take responsibility for these.

## Supported Environments
- The Lynx Authenticator is supported on Lynx Android and Lynx Desktop 2.0+

## Getting started

**Note:** be sure to read the [Warning and Limitations](#warning-and-limitations) section below.

`yarn add ual-lynx`

#### Dependencies

You must use one of the UAL renderers below.

React - `ual-reactjs-renderer`


PlainJS - `ual-plainjs-renderer`


#### Basic Usage with React

```javascript
import { Lynx } from 'ual-lynx'
import { UALProvider, withUAL } from 'ual-reactjs-renderer'

const exampleNet = {
  chainId: '',
  rpcEndpoints: [{
    protocol: '',
    host: '',
    port: '',
  }]
}

const App = (props) => <div>{JSON.stringify(props.ual)}</div>
const AppWithUAL = withUAL(App)

const lynx = new Lynx([exampleNet])

<UALProvider chains={[exampleNet]} authenticators={[lynx]}>
  <AppWithUAL />
</UALProvider>
```

### Warnings and Limitations
Using Lynx within your app is no different than using other authenticator plugins. However, if your application is being used from within the Lynx mobile app it is using an embedded browser to view the application. The main restriction is that the Lynx mobile app (and consequently the authenticator) can **ONLY** communicate with EOS Mainnet. So when setting up UAL, if you specify other chains it will not work. This is also true if you specify additional chains along with Mainnet. This can make testing difficult if your application is using contracts that are not yet deployed to Mainnet.

### Testing on Mainnet
For a simple test to verify that authentication is working, you can stick with system contracts that are already present on Mainnet (e.g. transfer). In this case you can run a simple app locally fronted by [ngrok](https://ngrok.com/). Lynx DOES have the ability to point to an app for testing wherever it is being hosted (i.e. the ngrok url), but the app must only use Mainnet. Below is a brief outline of how to test Lynx with a local instance of your app:

* Start up your test application
* If running locally, front it with ngrok
* In your Lynx mobile app
  - Login as usual
  - Navigate to the "Explore" tab
  - Open the test URL
    * On Android, click the menu dropdown in the upper-right corner and select "Test URL"
    * On iOS, tap on the top navigation bar 10 times and you'll be provided an input to put in a testing url

From this point on, the app should behave as expected.

## Contributing

[Contributing Guide](./CONTRIBUTING.md)

[Code of Conduct](./CONTRIBUTING.md#conduct)

## License

[MIT](./LICENSE)

## Important

See LICENSE for copyright and license terms.  Block.one makes its contribution on a voluntary basis as a member of the EOSIO community and is not responsible for ensuring the overall performance of the software or any related applications.  We make no representation, warranty, guarantee or undertaking in respect of the software or any related documentation, whether expressed or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall we be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or documentation or the use or other dealings in the software or documentation. Any test results or performance figures are indicative and will not reflect performance under all conditions.  Any reference to any third party or third-party product, service or other resource is not an endorsement or recommendation by Block.one.  We are not responsible, and disclaim any and all responsibility and liability, for your use of or reliance on any of these resources. Third-party resources may be updated, changed or terminated at any time, so the information here may be out of date or inaccurate.  Any person using or offering this software in connection with providing software, goods or services to third parties shall advise such third parties of these license terms, disclaimers and exclusions of liability.  Block.one, EOSIO, EOSIO Labs, EOS, the heptahedron and associated logos are trademarks of Block.one.

Wallets and related components are complex software that require the highest levels of security.  If incorrectly built or used, they may compromise users’ private keys and digital assets. Wallet applications and related components should undergo thorough security evaluations before being used.  Only experienced developers should work with this software.
