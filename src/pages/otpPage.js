import React, { Component } from "react";
import "../statics/OTPPage.css";
import ApiLayer from '../apiRequest/apiLayer';

const CODE_LENGTH = new Array(6).fill(0);

class otppage extends Component {
  input = React.createRef();
  constructor () {
      super()
     this.state = {
         userData: {},
        value: "",
        showTrials: false,
        focused: false,
        time: {},
        seconds: 60,
        shouldHide: false
      };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.validate = this.validate.bind(this);
    this.resend = this.resend.bind(this);
    this.validatethis = this.validatethis.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  };


  startTimer() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState ({
        time: timeLeftVar
    })
    if (this.timer === 0 && this.state.seconds > 0) {
        this.timer = setInterval(this.countDown, 1000);
       }
   }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds === 0) {
      clearInterval(this.timer);
      this.setState({
        shouldHide: true
     })
    }

  }


  handleClick = () => {
    this.input.current.focus();
  };
  handleFocus = () => {
    this.setState({ focused: true });
  };
  handleBlur = () => {
    this.setState({
      focused: false,
    });
  };
  handleKeyUp = e => {
    if (e.key === "Backspace") {
      this.setState(state => {
        return {
          value: state.value
        };
      });
    }
  };
  validate=(e)=>{
    e.preventDefault();
    console.log("hello",e.target.value, this.state.value);
       ApiLayer.validateOtp(this.state.userData.userid , this.state.value).then((response) => {

        if(response.code === 6){

            localStorage.setItem('userLoggedIn' , true);
            this.props.history.push("/profile");
        } else {
            var trials = response.trials
            if(trials > 0 ) {
            localStorage.setItem('trials' , trials-1);
            } else {
                this.props.history.push("/login");
            }
            this.setState({showTrials:true});
            setTimeout(() => {
                this.setState({
                    showTrials:false
                });
              }, 1000);
        }
    })
  }

  handleChange(event) {
    console.log("handle chamge",event.target.value)
   if(event.target.value.length <=6){
     this.setState({value: event.target.value});


   }
 }

 handleSubmit(event) {
   event.preventDefault();
   if( this.state.value.length ==6){
     this.validatethis( this.state.value)
   }
 }


  validatethis=(otp)=>{
    console.log("hello",otp);
       ApiLayer.validateOtp(this.state.userData.userid ,otp).then((response) => {

        if(response.code === 6){

            localStorage.setItem('userLoggedIn' , true);
            this.props.history.push("/profile");
        } else {
            var trials = response.trials
            if(trials > 0 ) {
            localStorage.setItem('trials' , trials-1);
            } else {
                this.props.history.push("/login");
            }
            this.setState({showTrials:true});
            setTimeout(() => {
                this.setState({
                    showTrials:false
                });
              }, 1000);
        }
    })
  }

  resend=(e) =>{
    e.preventDefault();
    ApiLayer.getUser(this.state.userData.userid).then((response) => {
        if(response.code === 1) {
           this.setState({
            shouldHide: false,
            seconds : 30
         })
         this.timer = 0;

         this.startTimer();
        }
        else {
          this.props.history.push("/login");

            console.log("Not sent Successfully",response.code);

        }
if(response.code === 4) {
  this.props.history.push("/login");
  console.log("Max attemots reached");


}


    })
  }

//   handleChange = e => {
//     const value = e.target.value;
//     console.log("value",value)
//
//     this.setState(state => {
// if(state.value.length ==6){
//   this.validatethis(this.state.value)
// }
//
//
//       if (state.value.length > 6) return null;
//       return {
//         value: (state.value + value)
//       };
//     });
//   };


  componentDidMount() {
    this.setState({
        userData : {
                userid : localStorage.getItem('userid'),
                trials : localStorage.getItem('trials')
        }
    });
    this.startTimer();

  }
  render() {
    const { value, focused } = this.state;

    const values = value.split("");

    const selectedIndex =
      values.length < CODE_LENGTH.length ? values.length : CODE_LENGTH.length - 1;

    const hideInput = !(values.length < CODE_LENGTH.length);

    return (<div className="row">
        <div className="col-md-3"></div>
          <div className="col-md-6"><br/> <br/>
         	<div className="wrapperotp">
                <div id="formContentotp"><br/>
                  	<h3>Enter OTP</h3><br/>
                  	<p className="otpcolor">Check your phone for the OTP</p><br/>
                    <form onSubmit={this.handleSubmit}>
                      <div className="row">
                        <div className="col-md-12">
                          <input type="number" className="inputotp" placeholder="One Time Password"
                            ref={this.input}
                             onChange={this.handleChange}
                             onKeyUp={this.handleKeyUp}
                             onFocus={this.handleFocus}
                             onBlur={this.handleBlur}/>
                          </div>
                          <div className="col-md-1"></div>
                          <div className="col-md-3 timer">
                            Resend in:00:{this.state.time.s}
                          </div>
                             <div className="col-md-4"></div>
                               <div className="col-md-3">
                                <button type="submit"  onClick={this.resend} className={`btn btn-primary btn-sm  ${this.state.shouldHide ? '' : 'hidden'}`} >Resend</button></div>
                                <div className="col-md-1"></div>
                                    <br/>
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                        <br/>
                          <button type="submit"  disabled={this.state.shouldHide} className="btn btn-primary btn-lg" >Login</button>
                          </div>
                           <div className="col-md-3"></div>
                           </div>
                            <br/>
                              </form></div>
                              <div className={`alert alert-success ${this.state.showTrials ? 'alert-shown' : 'alert-hidden'}`}>
                              <strong> Invalid OTP </strong>
                              You have <strong>{localStorage.getItem('trials')}</strong> left !!!
                          </div>
                        </div>
                      </div>
                  <div className="col-md-3"></div>
                </div>


    );
  }
}

export default otppage;
