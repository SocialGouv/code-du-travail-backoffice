import axios from "axios";
import React from "react";

import Main from "../src/layouts/main";
import Login from "../src/components/login";

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMounted: false,
      isLoading: true
    };

    this.answers = [];

    this.forceUpdate = this.forceUpdate.bind(this);
  }

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  componentDidUpdate() {
    if (this.isAutenticated() && this.state.isLoading) {
      axios
        .get("http://localhost:3200/answers")
        .then(({ data }) => {
          this.answers = data;
          this.setState({ isLoading: false });
        })
        .catch(console.warn);
    }
  }

  isAutenticated() {
    const jwt = sessionStorage.getItem("jwt");

    return typeof jwt === "string" && jwt.length > 0;
  }

  getContent() {
    switch (true) {
      case !this.state.isMounted:
        return <p>Loading...</p>;

      case !this.isAutenticated():
        return <Login onLog={() => this.forceUpdate()} />;

      case this.state.isLoading:
        return <p>Fetching answers...</p>;

      default:
        return this.getAnswers();
    }
  }

  getAnswers() {
    return this.answers.map(answer => (
      <div key={answer.id}>{answer.value}</div>
    ));
  }

  render() {
    return <Main>{this.getContent()}</Main>;
  }
}
