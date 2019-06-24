import React from 'react';
import { withStyles,makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {get} from 'axios';
import Web3 from 'web3';


const useStyles1 = makeStyles(theme => ({
    root: {
      flexShrink: 0,
      color: theme.palette.text.secondary,
      marginLeft: theme.spacing(2.5),
    },
  }));

 
function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;
  
    function handleFirstPageButtonClick(event) {
      onChangePage(event, 0);
    }
  
    function handleBackButtonClick(event) {
      onChangePage(event, page - 1);
    }
  
    function handleNextButtonClick(event) {
      onChangePage(event, page + 1);
    }
  
    function handleLastPageButtonClick(event) {
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    }
  
    return (
      <div className={classes.root}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }

const styles = theme => ({
  root: {
    width: '90%',           
    margin:'auto',    
    marginTop: theme.spacing(5),
    overflowX: 'auto',
    textAlign:'center',
  },
  table: {
    minWidth: 400,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent:'space-around'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing(1),
    width:200
  }
});

const createData = (id, contractaddr, balrupee, pgy, category) =>{
  return { id, contractaddr, balrupee, pgy, category };
}

const categories = [
    {
      value: 'Unspecified',
      label: 'Unspecified',
    },
    {
      value: 'Rent',
      label: 'Rent',
    },
    {
      value: 'Bet',
      label: 'Bet',
    },
    {
      value: 'Hire',
      label: 'Hire',
    },
    {
      value: 'Others',
      label: 'Others',
    },
  ];

class Transactions extends React.Component {
    constructor(props){
        super(props)
        this.state={
            rows :[
                createData(1, '0x14FCF', 2000, 30.2, 'unspecified'),
     
 
   

              ],
            balance:0,
            receiver:'0x32450c9161553Fb50e8e5D9B0A281bb1CD58a2a7',
            sender:'0xC4ad5E50BA51a94cA71bB80E9379b382E054093d',
            category:'Rent',
            contractAddressToBeSearched: '0x4D8078060C635c0434253228B364667554893823',
            page:0,
            rowsPerPage:5,
            eth2inr:0,
            eth2usd:0
        }
        this.setEventListeners=this.setEventListeners.bind(this);
       
    }
    async componentDidMount(){

      get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=INR,USD')
      .then(({data})=>{
        this.setState({
          eth2inr:data.INR,
          eth2usd:data.USD });
      });
      await this.setEventListeners();
    }
    setEventListeners(){
      
    this.props.factoryContract.events.contractCreated({
              fromBlock: 0
              }, function(error, event){ console.log("in above ");console.log(event.returnValues.newContractAddress);
        //alert(event.returnValues.newContractAddress);
     // this.state.rows.append(createData(1, event.returnValues.newContractAddress, this.state.Req, 30.2, 'unspecified'));
      })
          .on('data', function(event){console.log('optional callback');// same results as the optional callback above
              });
    }

    make_new_contract(){

      console.log('Deal Details : \n'+
         ' Receiver '+this.state.receiver+ '\n'+
         ' Sender '+this.state.sender+'\n'+
         ' Balance '+this.state.balance+'\n'+
         ' Category '+this.state.category+'\n'+
         ' curPrice '+this.state.eth2inr);
         //Math.round( this.state.eth2inr )
      console.log('curret account: '+this.props.thisAccount+ ' current price ',this.state.eth2inr);
      if(this.state.eth2inr!=0) 
       this.props.factoryContract.methods.createContract( Math.round( this.state.eth2inr ),this.state.sender,this.state.receiver,25000,this.state.category)
            .send({from:this.props.thisAccount}).then((err,res)=>console.log('ddsfine'));
      else
        console.log('Let Token Price To Be Fetched Please')
     
    }
   


    handleChange = name => event => {
        this.setState({[name]: event.target.value});
    };

        
    handleChangePage = (event, page) => {
        this.setState({page})
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({rowsPerPage:parseInt(event.target.value,10)});
    }
    render(){
        const {classes} = this.props
        const {rows,rowsPerPage,page} = this.state
        var emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
     return (   

            <div >
                <div style={{textAlign:'center',fontFamily:'roboto'}}>
                    <h1>
                        All deals
                    </h1>
                </div>
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="right">Contract Address</TableCell>
                                <TableCell align="right">Total Balance&nbsp;(₹)</TableCell>
                                <TableCell align="right">PGY</TableCell>
                                <TableCell align="right">Category</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                            <TableRow key={row.name}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell align="right">{row.contractaddr}</TableCell>
                                    <TableCell align="right">{row.balrupee}</TableCell>
                                    <TableCell align="right">{row.pgy}</TableCell>
                                    <TableCell align="right">{row.category}</TableCell>
                                </TableRow>
                            ))}

                            {emptyRows > 0 && (
                            <TableRow style={{ height: 48 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                colSpan={3}
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                inputProps: { 'aria-label': 'Rows per page' },
                                native: true,
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                            </TableRow>
                        </TableFooter>
                        </Table>
                    </div>
                </Paper>
                <Paper className={classes.root}>
                    <h1>
                        Add Deal
                    </h1>
                    <form className={classes.container} noValidate autoComplete="off">
                    <TextField
                        required
                        id="standard-with-placeholder"
                        label="Receiver"
                        value={this.state.receiver}
                        onChange={this.handleChange('receiver')}
                        placeholder="0x148"
                        className={classes.textField}
                        margin="normal"
                    />
                    <TextField
                        required
                        id="standard-with-placeholder"
                        label="Sender"
                        value={this.state.sender}
                        onChange={this.handleChange('sender')}
                        placeholder="0x148"
                        className={classes.textField}
                        margin="normal"
                    />
                    <TextField
                        id="standard-number"
                        label="Deal Required Balance ₹ "
                        required
                        value={this.state.balance}
                        onChange={this.handleChange('balance')}
                        type="number"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                    <TextField
                        id="standard-select-category"
                        select
                        required
                        label="Category"
                        className={classes.textField}
                        value={this.state.category}
                        onChange={this.handleChange('category')}
                        SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                        }}
                        margin="normal"
                    >
                        {categories.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                        ))}
                    </TextField>
                    </form>
                    <Button variant="contained" 
                        className={classes.button}
                        onClick={() => {this.make_new_contract();  }}
                        color = "primary"
                    >
                        Add new Contract
                    </Button>
                    <TextField
                        required
                        id="standard---placeholder"
                        label="Search By Contract Address"
                        value={this.state.contractAddressToBeSearched}
                        onChange={this.handleChange('contractAddressToBeSearched')}
                        placeholder=""
                        className={classes.textField}
                        margin="normal"
                    />
                   <Button variant="contained" 
                        className={classes.button}
                        onClick={() => {this.props.search_by_ca(this.state.contractAddressToBeSearched);  }}
                        color = "secondary"
                    >
                       Search
                    </Button>
      
                </Paper>
                
            </div>  
        );
    }
}

export default withStyles(styles)(Transactions);
