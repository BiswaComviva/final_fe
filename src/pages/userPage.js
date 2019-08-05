import React ,  {Component} from 'react';

class Profile extends Component {
    constructor(){
        super()
            this.state =  {
                userid:'',
                msisdn:''
            }
        }

        componentDidMount() {
            const userid = localStorage.getItem('userid');
            const userLoggedIn = localStorage.getItem('userLoggedIn');
            if(userid && userLoggedIn) {
            this.setState({
                userid: userid
            })
        } else  {
            this.props.history.push('/');
        }
    }


        render () {
            return (
                <div className="container"><br/><br/>
                    <div className="jumbotron">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="media">
                            <div className="media-left">
                              <img src="https://www.w3schools.com/bootstrap/img_avatar1.png" class="media-object"/>
                            </div>
                          </div>
                        </div>
                            <div className="col-md-1"></div>
                            <div className="col-md-5">
                        <div class="media-body">
                          <h4 class="media-heading">{this.state.userid}</h4>
                              <p>Hello world !!</p>
                        </div>
                      </div>
                  </div>
                    </div>
                </div>
            )
        }
    }

    export default Profile;
