var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Transaction = React.createClass({
  render: function() {
    return (
      <div className='transaction'>
        {this.props.children}
      </div>
    );
  }
});

var TransactionList = React.createClass({
  render: function() {
    var transactionNodes = this.props.data.map(function(transaction) {
      var hash = transaction.hash;
      return (
        <Transaction key={hash}>
          {hash}
        </Transaction>
      );
    });
    return (
      <div className='transactionList'>
        <ReactCSSTransitionGroup transitionName="example">
          {transactionNodes}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});

var TransactionBox = React.createClass({
  getInitialState: function() {
    return {data: new RingBuffer(10)};
  },
  componentDidMount: function() {
    if (window.MozWebSocket) {
      window.WebSocket = window.MozWebSocket;
    }
    var conn = new WebSocket('wss://ws.chain.com/v2/notifications');
    conn.onopen = function(ev) {
      var req = {type: 'new-transaction', block_chain: 'bitcoin'};
      conn.send(JSON.stringify(req));
    };
    var outer = this;
    conn.onmessage = function(ev) {
      var data = JSON.parse(ev.data);
      var payload = data.payload;
      if (payload !== undefined && payload.type === 'new-transaction') {
        outer.state.data.push(payload.transaction);
        outer.setState({data: outer.state.data});
      }
    };
    conn.onclose = function(ev) {
      var conn = new WebSocket('wss://ws.chain.com/v2/notifications');
    };
  },
  render: function() {
    return (
      <div className='transactionBox'>
        <h1>Transactions</h1>
        <TransactionList data={this.state.data} />
      </div>
    );
  }
});

React.render(
  <TransactionBox />,
  document.getElementById('content')
);
