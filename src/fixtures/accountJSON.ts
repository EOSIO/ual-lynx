const AccountJSON = `
{
  "account": {
    "account_name": "testtesttest",
    "head_block_num": 20247653,
    "head_block_time": "2018-10-19T23:25:02.500",
    "privileged": false,
    "last_code_update": "1970-01-01T00:00:00.000",
    "created": "2018-10-19T23:24:53.500",
    "core_liquid_balance": "0.0100 EOS",
    "ram_quota": 3984,
    "net_weight": 1000,
    "cpu_weight": 1000,
    "net_limit": {
      "used": 0,
      "available": 19155,
      "max": 19155
    },
    "cpu_limit": {
      "used": 0,
      "available": 3644,
      "max": 3644
    },
    "ram_usage": 2996,
    "permissions": [
      {
        "perm_name": "active",
        "parent": "owner",
        "required_auth": {
        "threshold": 1,
        "keys": [
          {
            "key": "EOS11111",
            "weight": 1
          }
        ],
        "accounts": [],
        "waits": []
        }
      },
      {
        "perm_name": "owner",
        "parent": "",
        "required_auth": {
          "threshold": 1,
          "keys": [
            {
              "key": "EOS22222",
              "weight": 1
            }
          ],
          "accounts": [],
          "waits": []
        }
      }
    ],
    "total_resources": {
      "owner": "testtesttest",
      "net_weight": "0.1000 EOS",
      "cpu_weight": "0.1000 EOS",
      "ram_bytes": 2584
    },
    "self_delegated_bandwidth": null,
    "refund_request": null,
    "voter_info": null,
    "tokens": [
      "0.0100 EOS"
    ]
  },
	"tokens": [
		{
			"symbol": "EOS",
			"balance": "2.0436 EOS",
			"contract": "eosio.token",
			"precision": 4
		},
		{
			"symbol": "EETH",
			"balance": "10000.0000 EETH",
			"contract": "ethsidechain",
			"precision": 4
		},
		{
			"symbol": "PUB",
			"balance": "4846.8660 PUB",
			"contract": "publytoken11",
			"precision": 4
		},
		{
			"symbol": "EDNA",
			"balance": "0.0000 EDNA",
			"contract": "ednazztokens",
			"precision": 4
		}
	],
	"version": "0.4.8",
	"session": "Zeyo6L7VVlC2"
}`

export {
  AccountJSON
}
