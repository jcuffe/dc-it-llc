import { Component } from "react"
import fetch from "isomorphic-unfetch"

class Callback extends Component {
  static async getInitialProps({ res, query }) {
    const data = await fetch("https://dc-it-llc.auth0.com/oauth/token", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: query.code,
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        redirect_uri: process.env.AUTH0_REDIRECT_URI
      })
    })

    const decoded = await data.json()
    return { decoded }
  }

  render() {
    return (
      <div>Access: { this.props.decoded.access_token }</div>
    )
  }
}

export default Callback