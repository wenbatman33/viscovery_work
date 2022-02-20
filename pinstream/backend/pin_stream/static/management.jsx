class VideosComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            data:[]
		};
	}

	getvideos(count){
	    if(count>2){
	        return
	    }
	    var uid = localStorage.getItem('uid');
	    var token = localStorage.getItem('token');
	    var refresh_token = localStorage.getItem('refresh_token');
        fetch(`/api/v1/video/${uid}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then((response) =>{
            if(response.status == 200){
                console.info(200)
                return response.json();
            }else if(response.status == 400){
                console.info(400)
                var data = new FormData();
                data.append('uid',uid)
                data.append('refresh_token',refresh_token)
                return fetch('/api/v1/token', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Token ' + token
                    },
                    body:data
                }).then((response) =>{
                    return response.json();
                }).then(function (json) {
                    if(json && json.info){
                        var info = json.info;
	                    var uid = localStorage.setItem('uid',info.uid);
	                    var token = localStorage.setItem('token',info.token);
	                    var refresh_token = localStorage.setItem('refresh_token',info.refresh_token);
	                    this.getvideos(count+1)
                    }
                })
            }
            return null;
        }.bind(this)).then(function (json) {
            if(json && json.videos){
               this.setState({data: json.videos});
            }else{
                console.info('no data')
            }
        }.bind(this)).catch(function(ex) {
            console.log('parsing failed', ex)
        });
	}

	componentDidMount() {
	    //todo error
	    this.getvideos(1)
	}

    componentWillReceiveProps(nextProps) {
        if(nextProps.rvid&&this.state.data&&this.state.data.length>0){
            var data = this.state.data.filter(function(i){ return i.id!=nextProps.rvid})
            //todo load server data?
            this.setState({data:data});
        }
    }

    websitename(type){
        var websiteName='';
        switch (type){
            case '0':
                websiteName='Facebook';
                break;
            case '1':
                websiteName='Youtube';
                break;
            case '2':
                websiteName='Dailymotion';
                break;
            case '3':
                websiteName='Vimeo';
                break;
        }
        return websiteName;
    }

	render() {
	    if(!(this.state.data&&this.state.data.length)){
	        return <div></div>
	    }
	    var imgstyle={
	        width:'227px',
	        height:'128px'
	    };
		return (
			<div className="row">{
                    this.state.data.map(function(videoinfo,index){
                        var title=videoinfo.title.substring(0,20)
                        title+= videoinfo.title.length>20?" ......":""
                      return <div className="col-sm-6 col-md-4" data-id={videoinfo.id} key={index}>
                        <div className="thumbnail">
                          <img src={videoinfo.imgurl} style={imgstyle}/>
                          <div className="caption">
                            <h3>{this.websitename(videoinfo.website)}</h3>
                            <p title={videoinfo.title} >{title}</p>
                            <p>
                                <button onClick={this.props.openmodal.bind(this,videoinfo.url,videoinfo.website,videoinfo.id)} className="btn btn-primary" >View</button>
                            </p>
                          </div>
                        </div>
                      </div>
                }.bind(this))
              }
            </div>
		);
	}
}

class AccountState extends React.Component{
    constructor(props) {
		super(props);
		this.state = {
            statetext:'Log in'
        };
	}

    componentDidMount(){
        var uid=localStorage.getItem('uid')
        if(uid){
            this.setState({statetext:'Log out'})
        }
    }

    changeAccountState(){
        if(this.state.statetext=='Log out'){
            localStorage.removeItem('uid');
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
        }
        window.location.href='/?out=1';
    }

    render(){
        return (<div><a href="#" onClick={this.changeAccountState.bind(this)} class="navbar-link">{this.state.statetext}</a></div>)
    }
}

ReactDOM.render(<AccountState/>,document.getElementById('account-state'));

class VideoModalComponent extends React.Component{
    constructor(props) {
		super(props);
	}

    removeVideo(){
        console.info('remove')
        if(confirm('你確定要取消收藏嗎？'))
        {
            var uid = localStorage.getItem('uid');

            const formData = new FormData();
            formData.append('uid', uid);
            formData.append('vid', this.props.vid);

            fetch(`/api/v1/video`, {method: 'delete', body : formData})
            .then((response) =>
                response.json()
            )
            .then(function (json) {
                // window.location.reload()
                console.info(json)
                console.info('Success!')
                this.props.closemodal(this.props.vid)
            }.bind(this)).catch(function(ex) {
                console.log('parsing failed', ex)
            });
        }
    }

    render(){
        var element=''
        if(this.props.vsrc){
            if(this.props.website==0){
                element= <div><div className="fb-video" data-href={this.props.vsrc} data-width="800" data-show-text="false"></div></div>
                setTimeout(function(){ FB.XFBML.parse(); }, 500);
            }else{
                element=<div className="embed-responsive embed-responsive-4by3 embed-responsive-model"><iframe id="modal-iframe" className="embed-responsive-item" src={this.props.vsrc} width="480" height="280" frameborder="0" allowFullScreen></iframe></div>
            }
        }
        return (<div>
                    <div id="myModal" className="my-modal">
                      <span className="modal-close cursor" onClick={this.props.closemodal.bind(this)}>&times;</span>
                      <div className="my-modal-content">
                        {element}
                        <div className="my-modal-toolbar">
                            <div className="col-sm-11">
                                <img src="/static/saved_64.png" alt="remove" className="pull-right img-rounded" onClick={this.removeVideo.bind(this)}/>
                            </div>
                        </div>
                      </div>
                    </div>
                </div>)
    }
}

class AppComponent extends React.Component{
    constructor(props) {
		super(props);
		this.state = {
            vid:'',
            vsrc:'',
            rvid:'',
            website:''
		};
	}

    closeModal(vid) {
        document.querySelector('body').className=''
        this.setState({vsrc:'',vid:'',rvid:vid});
        document.getElementById('myModal').style.display = "none";
    }

    openModal(url,website,id) {
        this.setState({vsrc:url,vid:id,website:website});
        document.querySelector('body').className='noscroll';
        document.getElementById('myModal').style.display = "block";
    }

    handleReload(){
        this.setState({isreload:false});
    }

	handleModalInfo(data){
	    this.setState({vid:data.vid,vsrc:data.vsrc});
	}

	render() {
	    return (<div>
	        <VideosComponent openmodal={this.openModal.bind(this)} modalinfo={this.handleModalInfo.bind(this)} rvid={this.state.rvid} ></VideosComponent>
	        <VideoModalComponent closemodal={this.closeModal.bind(this)} vid={this.state.vid} vsrc={this.state.vsrc} website={this.state.website} ></VideoModalComponent>
	    </div>)
	}

}

ReactDOM.render(<AppComponent/>,document.getElementById('videos'));