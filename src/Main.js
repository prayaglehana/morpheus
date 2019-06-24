import React, {Component} from 'react';
import './App.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ClipboardIcon from 'react-clipboard-icon'
import AddButton from './add.png'
import {get} from 'axios';
import { tsImportEqualsDeclaration } from '@babel/types';

class Main extends Component{
  constructor(props){
    super(props);
    this.state={
      contractDetails:'',
      contractDetailsCopy:false,
      sender:'',
      receiver:'',

      curPgy:'',  
      curRupee:'',

      pgy:'',
      rupee:'',
      Vold:'',

      addPgy:'',
      addRupee: '',

      dealToken:'',
      dealTopic:'Flat for Rent',
      dealDuration:'8 months',
      dealDetailsCopy:false,
      dealTimeLeft:'7 months 6 days/ 306803 minutes',
      securityMoney:'',
      securitySender:'',
      securityReceiver:'',
      exist : false,
      secSender : false,
      secReceiver : false,
      lockStatus:false,
      satisfiedStatus:false,
      dealDoneStatus:false,
      eth2inr:undefined,
      eth2usd:'',
      description:'Receiver has to provide me with a flat for 8 months at Satya nagar, Delhi from 1 jan 2018 to 1 august 2018.'
    }
    this.onContractDetailsCopyClick = this.onContractDetailsCopyClick.bind(this);
    this.onDealDetailsCopyClick = this.onDealDetailsCopyClick.bind(this);    
    this.handleChange = this.handleChange.bind(this);

    this.setEventListeners=this.setEventListeners.bind(this);
    this.addMoneyToDeal=this.addMoneyToDeal.bind(this);
    this.addSecurityMoney=this.addSecurityMoney.bind(this);
    this.lockDeal=this.lockDeal.bind(this);
    this.satsfyDeal=this.satsfyDeal.bind(this);
    this.claimReward=this.claimReward.bind(this);
  }
  addMoneyToDeal(){
    console.log( parseInt(Math.round(this.state.addPgy*10000)));
    console.log(" eth2inr "+this.state.eth2inr);
    if(this.state.eth2inr!==undefined) {
      this.props.dealContract.methods.addmoney(parseInt(Math.round(this.state.eth2inr)),parseInt(Math.round(this.state.addPgy*10000)))
      .send({from:this.props.thisAccount
      }).then((err,res)=>console.log('done'));
    }


  }

  lockDeal(){
    console.log('deal lock called');
    if(!this.state.lockStatus)
      this.props.dealContract.methods.lockDeal().send({from: this.props.thisAccount}).then((err,res)=>console.log('called'));
    else
     this.props.dealContract.methods.unlockDeal().send({from: this.props.thisAccount}).then((err,res)=>console.log('called'));

  }

  satsfyDeal(){
  if(!this.state.satisfiedStatus)
    this.props.dealContract.methods.satisfyDeal().send({from: this.props.thisAccount}).then((err,res)=>console.log('called'));
  else
    this.props.dealContract.methods.unsatisfyDeal().send({from: this.props.thisAccount}).then((err,res)=>console.log('called'));
  }

  claimReward(){
    console.log(parseInt(Math.round(this.state.eth2inr)))
    if(this.state.eth2inr!==undefined)
       this.props.dealContract.methods.claimReward( parseInt(Math.round(this.state.eth2inr)),false).send({from: this.props.thisAccount}).then((err,res)=>console.log('called'));
  }

  addSecurityMoney(isSender){
    if(this.state.eth2inr!==undefined){
      if(isSender){
        console.log("Vold : "+parseInt( Math.round(this.state.eth2inr)) +" toSend "+parseInt(Math.round(this.state.securitySender/this.state.Vold)))
        this.props.dealContract.methods.addSecurity(parseInt( Math.round(this.state.eth2inr)) ,parseInt(Math.round(10000*this.state.securitySender/this.state.Vold)) ).send({from:this.props.thisAccount })
      }
      else{
        console.log('security receiver v '+this.state.securityReceiver)
        console.log("Vold : "+parseInt( Math.round(this.state.eth2inr)) +" toSend "+parseInt(Math.round(10000*this.state.securityReceiver/this.state.Vold)))
        this.props.dealContract.methods.addSecurity(parseInt( Math.round(this.state.eth2inr)) ,parseInt(Math.round(10000*this.state.securityReceiver/this.state.Vold)) ).send({from:this.props.thisAccount }) ;
      }
    }
  }

   


  
   componentWillMount(){
    var THIS=this;
    console.log('dealContract')
    console.log(this.props.dealContract);
    this.props.dealContract.methods.showDetails( )
    .call({from:this.props.thisAccount},function(err,data){
      console.log('data',data);
      THIS.setState({
        sender:data.sender,
        receiver:data.receiver,
        securityMoney : parseInt(data.realsecurityDepositPrice._hex,16),
        Vold: parseInt(data.Vold._hex,16),
        contractDetails : THIS.props.ca ,
        dealToken : THIS.props.ca,

        rupee: parseInt(data.realrequiredPrice._hex,16),
        pgy : data.realrequiredPrice/data.Vold,

        curPgy : parseInt(data.curBalanceToken._hex,16),
        curRupee : parseInt(data.curBalanceToken._hex,16) * parseInt(data.Vold._hex,16)

      })
    
    });

    this.props.dealContract.methods.showStatus( )
    .call({from:this.props.thisAccount},function(err,data){
      console.log('data',data);
      THIS.setState({
        exist : data.exist,
        secSender : data.secSender,
        secReceiver : data.secReceiver,
        lockStatus: data.lock,
        satisfiedStatus : data.satisfied,
        dealDoneStatus : data.rewardClaimed

      })
    
    });
     this.setEventListeners();
  }
  setEventListeners(){
     var THIS=this;
    this.props.dealContract.events.eventaddmoney({fromBlock: 0}, function(error, event)
         {   console.log("in eventaddmoney ");console.log(event.returnValues);
          
        THIS.setState({ Vold:parseInt(event.returnValues.Vold._hex,16), curPgy:parseInt(event.returnValues.curBalanceToken._hex,16)/10000
        ,curRupee : parseInt(event.returnValues.curBalanceToken._hex,16)*parseInt(event.returnValues.Vold._hex,16)/10000 })
         })
    
    
    this.props.dealContract.events.eventSecurityDeposited({fromBlock: 0}, function(error, event)
         {   console.log("in eventSecurityDeposited ");console.log(event.returnValues.secSender); })
    
    this.props.dealContract.events.eventDealLocked({fromBlock: 0}, function(error, event)
         { THIS.setState({lockStatus:event.returnValues.lock});
           console.log("in eventDealLocked ");console.log('locked Status '+event.returnValues.lock); })
    this.props.dealContract.events.eventDealSatisfied({fromBlock:0},function(error,event){
      THIS.setState({satisfiedStatus:event.returnValues.satisfied});
    })
    this.props.dealContract.events.eventRewardClaimed({fromBlock: 0}, function(error, event)
         {   console.log("in eventRewardClaimed ");console.log(event.returnValues.newContractAddress);
          THIS.setState({dealDoneStatus:true}) })
    
    this.props.dealContract.events.eventupdaterequiredBalance({fromBlock: 0}, function(error, event)
         {   console.log("in eventupdaterequiredBalance ");console.log(event.returnValues.newContractAddress); })
        
  }
  componentDidMount() {
    console.log('componentDidMount',this.props.dealContract);
    this.interval = setInterval(() => {
      get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=INR,USD')
      .then(({data})=>{
        this.setState({
          eth2inr:data.INR,
          eth2usd:data.USD
        })
      })
    }, 10000);
  }
  componentWillUnmount() {
  //  clearInterval(this.interval);
  }
  onContractDetailsCopyClick(){
    this.setState({contractDetailsCopy: true});
    console.log('Copy to clipboard Contract details')
    setTimeout(()=>{this.setState({contractDetailsCopy:false})},2000);
  }
  onDealDetailsCopyClick(){
    this.setState({dealDetailsCopy: true});
    console.log('Copy to clipboard Deal details')
    setTimeout(()=>{this.setState({dealDetailsCopy:false})},800);
  }
  handleChange(event) {
    console.log(event.target.name);
    if(event.target.name=="addPgy") this.setState({ addRupee:event.target.value*this.state.eth2inr })
    else if(event.target.name=="addRupee") this.setState({ addPgy:event.target.value/this.state.eth2inr})

    this.setState({[event.target.name]: event.target.value});
  }
  render(){
    var sizeOfCol = 30
    return (
      <div className="App">
        <div className="top-section">
            <span style={{fontSize:20}}>Contact Details</span>
            <br/>
            {this.state.contractDetails}
            <CopyToClipboard text={this.state.contractDetails}
              onCopy={this.onContractDetailsCopyClick}>
              <ClipboardIcon
                size={20}
                style={{marginLeft:8,cursor:'pointer'}}
                title='Copy'
              />
            </CopyToClipboard>
            {this.state.contractDetailsCopy&&<span style={{marginLeft:8,color:"black"}}>Copied</span>}
            <br/>
            <span style={{margin:'auto',background:'transparent',color:'white',padding:5,position:'relative',top:10}}>
              <i className="fas fa-info-circle" style={{marginRight:5,fontSize:20,}}></i>
              The Current Price of PGY Token is 
                <span style={{color:'#2C3335',fontSize:18,margin:'auto 5px'}}> ₹ {this.state.eth2inr} </span>
                 or 
                <span style={{color:'#2C3335',fontSize:18,margin:'auto 5px'}}> $ {this.state.eth2usd}</span>                  
            </span>
        </div>

        <div className="sender-receiver">
          <div>
            <span>Sender </span>
            <span style = {{background:'white', padding:5,marginLeft:10}}>
              {this.state.sender}
            </span>
          </div>
          <div>
            <span>Receiver </span>
            <span style = {{background:'white', padding:5,marginLeft:10}}>
              {this.state.receiver}
            </span>
          </div>
        </div>

        <div className="add-money">
          <div style={{flex:3,margin:8,minWidth:100}}>Deal Balance </div>
          <div style={{flex:5,minWidth:150,margin:"8px auto"}}>
            <div style = {{padding:5,marginLeft:10,borderRadius:5,marginBottom:7}}>
              <b>Required Balance</b>
            </div>
            <div style = {{background:'#e6ffee', padding:5,marginLeft:10,borderRadius:5,marginBottom:7}}>
              {this.state.pgy} PGY
            </div>
            <div >
              <div style = {{background:'#e6ffee', padding:5,marginLeft:10,borderRadius:5}}>
              {this.state.rupee} ₹
              </div>
            </div>
          </div>
          <div style={{flex:5,minWidth:150,margin:"8px auto"}}>
            <div style = {{padding:5,marginLeft:10,borderRadius:5,marginBottom:7}}>
              <b>Current Balance</b>
            </div>
            <div style = {{background:'#e6ffee', padding:5,marginLeft:10,borderRadius:5,marginBottom:7}}>
              {this.state.curPgy} PGY
            </div>
            <div >
              <div style = {{background:'#e6ffee', padding:5,marginLeft:10,borderRadius:5}}>
                {this.state.curRupee} ₹
              </div>
            </div>
          </div>
          <div style={{flex:5,minWidth:350,margin:"8px auto"}}>
            <div style = {{padding:5,marginLeft:10,borderRadius:5,marginBottom:7}}>
              <b>Add Money</b>
            </div>
            <div style={{marginBottom:7}}>
              <input type="text" value={this.state.addPgy} onChange={this.handleChange} name="addPgy"/>
                PGY
              </div>
              <div >
              <input type="text" value={this.state.addRupee} onChange={this.handleChange} name="addRupee"/>
                ₹
              </div>
            </div>
          
          <div style={{flex:2,margin:'auto',minWidth:100}}>
            Add Money
            <img 
              src={AddButton} 
              alt="add button"
              style={{width:40,height:40,marginLeft:5,marginBottom:-12,cursor:'pointer'}}
              onClick={()=>{this.addMoneyToDeal();}}
            />
          </div>
        </div>

        <div className="deal">
          <div className="issue">
            <div>
              Deal
              <span style={{background:'#99AAAB',margin:10,padding:5,borderRadius:5}}>
                {this.state.dealToken}
              </span>
              <CopyToClipboard text={this.state.dealToken}
              onCopy={this.onDealDetailsCopyClick}>
              <ClipboardIcon
                size={20}
                style={{marginLeft:8,cursor:'pointer'}}
                title='Copy'
              />
              </CopyToClipboard>
              {this.state.dealDetailsCopy&&<span style={{marginLeft:8,color:"black"}}>Copied</span>}
            </div>
            <div style={{display:'flex'}}>
              <span style={{flex:2}}>Topic:</span>
              <span style={{flex:3}}>{this.state.dealTopic}</span>
            </div>
            <div style={{display:'flex'}}>
              <span style={{flex:2}}>Deal Duration:</span>
              <span style={{flex:3}}>{this.state.dealDuration}</span>
            </div>
            <div style={{display:'flex'}}>
              <span style={{flex:2}}><i className="fas fa-hourglass-half"></i>  Left:</span>
              <span style={{flex:3}}>{this.state.dealTimeLeft}</span>
            </div>
            <button onClick={()=>console.log('Raise an Issue Button clicked')}>
              Raise an Issue 
              <i style={{marginLeft:5}} className="fas fa-exclamation-triangle"></i>
            </button>
          </div>
          <div className="deal-options">
            <div className="deal-options1">
              <div style={{display:'flex'}}>
                <span style={{flex:2}}>
                  Security Deposit
                </span>
                <input style={{flex:5}} type="text" value={this.state.securityMoney} onChange={this.handleChange} name="securityMoney"/>
                <span style={{marginTop:10}}>₹</span>
              </div>
              <div style={{display:'flex'}}>
                <span style={{flex:2}}>
                  Sender
                </span>
                <input style={{flex:5}} type="text" value={this.state.securitySender} onChange={this.handleChange} name="securitySender"/>
                <img 
                  src={AddButton} 
                  alt="add sender money button"
                  style={{width:25,height:25,marginLeft:5,marginBottom:-12,cursor:'pointer'}}
                  onClick={()=>this.addSecurityMoney(true)}
                />
              </div>
              <div style={{display:'flex'}}>
                <span style={{flex:2}}>
                  Receiver
                </span>
                <input style={{flex:5}} type="text" value={this.state.securityReceiver} onChange={this.handleChange} name="securityReceiver"/>
                <img 
                  src={AddButton} 
                  alt="add receiver money button"
                  style={{width:25,height:25,marginLeft:5,marginBottom:-12,cursor:'pointer'}}
                  onClick={()=>this.addSecurityMoney(false)}
                />
              </div>
              <button onClick={()=>console.log('Raise an Issue Button clicked')}>
                Cancel This Deal
              </button>
            </div>
            <div style={{width:5,height:230,background:'#fff',margin:'auto 5px',borderRadius:5}} className="hide1">
              <div style={{width:'100%',height:sizeOfCol+'%',background:'#FAC42F',borderRadius:5}}></div>
              <div style={{width:'100%',height:(100-sizeOfCol)+'%',background:'#FFF', borderRadius:5}}></div>
            </div>
            <div className="deal-options2">
              <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                <span>Locked</span>
                <span 
                  style={{background:'#25CCF7',padding:6,borderRadius:5,marginTop:-3,cursor:'pointer'}}
                  onClick={()=>{this.lockDeal();}}
                  >
                  Lock
                </span>
                <span>
                  {
                    this.state.lockStatus?
                    <i className="far fa-check-circle" style={{fontSize:25,color:'#019031'}}></i>:
                    <i className="fas fa-sync-alt rotating" style={{fontSize:25}}></i>           
                  }
                </span>
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                <span>Satisfied</span>
                <span 
                  style={{background:'#25CCF7',padding:6,borderRadius:5,marginTop:-3,cursor:'pointer'}}
                  onClick={()=>{this.satsfyDeal();}}
                  >
                  Satisfy
                </span>
                <span>
                  {
                    this.state.satisfiedStatus?
                    <i className="far fa-check-circle" style={{fontSize:25,color:'#019031'}}></i>:
                    <i className="fas fa-sync-alt rotating" style={{fontSize:25}}></i>           
                  }
                </span>
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                <span >Deal Done</span>
                <span 
                  style={{background:'#25CCF7',padding:6,borderRadius:5,marginTop:-3,width:55,cursor:'pointer'}}
                  onClick={()=>{this.claimReward();}}
                  >
                  Claim Reward
                </span>
                <span>
                  {
                    this.state.dealDoneStatus?
                    <i className="far fa-check-circle" style={{fontSize:25,color:'#019031'}}></i>:
                    <i className="fas fa-sync-alt rotating" style={{fontSize:25}}></i>           
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="description">
          <h3>
            Description
          </h3>
          <span>
            {this.state.description}
          </span>
        </div>
      </div>
    );
  }
}
export default Main;
