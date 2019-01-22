import { Component } from "react"
import querystring from "querystring"

class Login extends Component {
  static async getInitialProps({ res }) {
    const query = querystring.stringify({
      response_type: "code",
      state: "abcdefg",
      client: process.env.AUTH0_CLIENT_ID,
      redirect_uri: process.env.AUTH0_REDIRECT_URI
    })
    const endpoint = "https://dc-it-llc.auth0.com/login"
    const Location = [endpoint, query].join("?")
    res.writeHead("302", { Location })
    res.end()
  }
}

export default Login