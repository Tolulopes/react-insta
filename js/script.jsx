var ITEMS_PER_PAGE = 6;
var LIMIT = 20;
var cx = React.addons.classSet;

var InstaThumbnail = React.createClass({
  getInitialState: function() {
    return {
      isDefault: true
    };
  },

  propTypes: {
    items: React.PropTypes.array.isRequired
  },

  updateViewMode: function (isDefault) {
    this.setState({isDefault: isDefault});
  },

  getLikesSVG: function () {
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
        <path fill="#fff" d="M23.6 2c-3.363 0-6.258 2.736-7.599 5.594-1.342-2.858-4.237-5.594-7.601-5.594-4.637 0-8.4 3.764-8.4 8.401 0 9.433 9.516 11.906 16.001 21.232 6.13-9.268 15.999-12.1 15.999-21.232 0-4.637-3.763-8.401-8.4-8.401z"></path>
      </svg>`
    )
  },

  getCommentsSVG: function () {
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
        <path fill="#fff" d="M16 2c8.837 0 16 5.82 16 13s-7.163 13-16 13c-0.849 0-1.682-0.054-2.495-0.158-3.437 3.437-7.539 4.053-11.505 4.144v-0.841c2.142-1.049 4-2.961 4-5.145 0-0.305-0.024-0.604-0.068-0.897-3.619-2.383-5.932-6.024-5.932-10.103 0-7.18 7.163-13 16-13z"></path>
      </svg>`
    )
  },

  render: function () {
    var className = cx({
      'is-default': this.state.isDefault,
      'insta-thumbnails': true
    });

    var listNodes = this.props.items.map(function (item, i) {
      return (
        <li key={i} className='insta-thumbnail'>
          <figure>
            <img src={item.images.low_resolution.url} />
            // <Overlay prop={item}/>
              <div className='overlay'>
                <span className='likes'>
                  <span dangerouslySetInnerHTML={{__html: this.getLikesSVG()}}></span> {item.likes.count}
                </span>
                <span className='comments'>
                  <span dangerouslySetInnerHTML={{__html: this.getCommentsSVG()}}></span> {item.comments.count}
                </span>
              </div>
          </figure>
        </li>
      )
    }, this);

    return (
      <section className={className}>
        <ToolBar fnc={this.updateViewMode}/>
        <ul>
          {listNodes}
        </ul>
      </section>
    );
  }

});

var ToolBar = React.createClass({
  updateViewMode: function (isDefault) {
    this.props.fnc(isDefault);
  },

  render: function () {
    return (
      <div className='tool-bar'>
        <ViewToggler func={this.updateViewMode}/>
      </div>
    )
  }
});

var ViewToggler = React.createClass({
  toggleView: function (isDefault) {
    this.props.func(isDefault);
  },

  getFourGridSVG: function () {
    return (
      `<svg class='four-grid' height="20" width="55" xmlns="http://www.w3.org/2000/svg">
          <g>
            <rect class='container' stroke="#005fbf" height="20" width="55" y="0" x="0" stroke-width="0.5" fill="none" />
            <rect class='block' y="2.75" x="3.25" stroke-width="0.5" />
            <rect class='block' y="2.75" x="16.25" stroke-width="0.5" />
            <rect class='block' y="2.75" x="29.25" stroke-width="0.5" />
            <rect class='block' y="2.75" x="42.25" stroke-width="0.5" />
          </g>
      </svg>`
    )
  },

  getThreeGridSVG: function () {
    return (
      `<svg class='three-grid' height="20" width="55" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect class='container' stroke="#005fbf" height="20" width="55" y="0" x="0" stroke-width="0.5" fill="none" />
          <rect class='block' height="14" width="14" y="2.75" x="3.25" stroke-width="0.5" />
          <rect class='block' height="14" width="14" y="2.75" x="20.25" stroke-width="0.5" />
          <rect class='block' height="14" width="14" y="2.75" x="37.25" stroke-width="0.5" />
        </g>
    </svg>`
    )
  },

  render: function () {
    return (
      <span className='view-toggler'>
        <span onClick={this.toggleView.bind(null, true)} dangerouslySetInnerHTML={{__html: this.getThreeGridSVG()}}></span>
        <span onClick={this.toggleView.bind(null, false)} dangerouslySetInnerHTML={{__html: this.getFourGridSVG()}}></span>
      </span>
    )
  }
});

var InstaContainer = React.createClass({
    getInitialState: function () {
      return {
        items: []
      };
    },

    componentWillMount: function () {
      var instaURL = 'https://api.instagram.com/v1/media/popular?client_id=' + this.props.apiKey + '&callback=?';
      $.getJSON(instaURL)
        .done(function (result) {
          if (this.isMounted() && result.meta && result.meta.code === 200) {
            console.log(result.data);
            this.setState({
              items: result.data.splice(0, LIMIT),
              loaded: true
            });
          }
        }.bind(this));
    },

    getPulseSVG: function () {
      return (
        `<svg class='pulse' width='100' height='100' viewBox='0 0 100 100' stroke='#125688'>
            <g fill='none' fill-rule='evenodd' stroke-width='2'>
            <circle cx='50' cy= '50' r='1'>
                <animate attributeName='r' begin='0s' dur='1.8s' values='1; 20' calcMode='spline' keyTimes='0; 1' keySplines='0.165, 0.84, 0.44, 1' repeatCount='indefinite' />
                <animate attributeName='stroke-opacity' begin='0s' dur='1.8s' values='1; 0' calcMode='spline' keyTimes='0; 1' keySplines='0.3, 0.61, 0.355, 1' repeatCount='indefinite' />
            </circle>
            <circle cx='50' cy='50' r='1'>
                <animate attributeName='r' begin='-0.9s' dur='1.8s' values='1; 20' calcMode='spline' keyTimes='0; 1' keySplines='0.165, 0.84, 0.44, 1' repeatCount='indefinite' />
                <animate attributeName='stroke-opacity' begin='-0.9s' dur='1.8s' values='1; 0' calcMode='spline' keyTimes='0; 1' keySplines='0.3, 0.61, 0.355, 1' repeatCount='indefinite' />
            </circle>
            </g>
        </svg>`
        );
    },

    render: function () {
      if (this.state.items.length) {
        return (
          <div>
            <InstaThumbnail items={this.state.items}/>
          </div>
        );
      }

      return (
          <div className="svg-container" dangerouslySetInnerHTML={{__html: this.getPulseSVG()}}>
          </div>
      );
    }
});

React.render(<InstaContainer apiKey="642176ece1e7445e99244cec26f4de1f"/>, document.getElementById('carousel-container'));
