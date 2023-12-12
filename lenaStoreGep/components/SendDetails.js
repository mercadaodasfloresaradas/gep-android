import {View, Text, StyleSheet} from 'react-native';
import React, { Component } from 'react';
import { purchase } from '../utilities/APIRequest';

export default class SendDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sale: this.getEmptySale(),
      id: props.saleData.id,
      type: props.saleData.state,
    };

    this.updateSendDetails = this.updateSendDetails.bind(this);
  }

  getEmptySale(){
    return {
      id: '',
      name: '',
      destName: '',
      phone: '',
      destPhone: '',
      address: '',
      priceTotal: '',
      date: '',
      state:'',
      giftMessage: '',
      deliverDate: 0,
    };
  }

  componentDidMount() {
    this.updateSendDetails(this.updateProducts);
  }

  updateSendDetails(){
    global.globalApp.showOverlay();

    purchase(this.state.id, this.state.type, 'd').then((sale)=>{
        global.globalApp.closeOverlay();
        if (sale){
            this.setState({sale});
            //global.globalApp.debug(JSON.stringify({sale, test: this.state.type}));
        } else {
         this.setState({sale: this.getEmptySale()});
       }
      // eslint-disable-next-line handle-callback-err
      }).catch((err)=>{});
  }

 deliveryDate = () => (new Date(this.state.sale.deliverDate));

  render() {
    return (
      <View style={styles.container}>
          <View style={[styles.elementRow]}>
            <Text>
              {
                this.state.sale.name ?
                  `Nome comprador: 
${this.state.sale.name}` :
                  '---'
              }
            </Text>
          </View>
          <View style={[styles.elementRow]}>
            <Text>
              {
                this.state.sale.phone ?
                  `Telefone comprador: 
${this.state.sale.phone}` :
                  '---'
              }
            </Text>
          </View>
          <View style={[styles.elementRow, styles.space]}>
            <Text>
              {
                this.state.sale.NIF ?
                  `NIF comprador: 
${this.state.sale.NIF}` :
                  '---'
              }
            </Text>
          </View>
          <View style={[styles.elementRow]}>
            <Text>
              {
                this.state.sale.destName ?
                  `Nome destinatário: 
${this.state.sale.destName}` :
                  '---'
              }
            </Text>
          </View>
          <View style={[styles.elementRow]}>
            <Text>
              {
                this.state.sale.destPhone ?
                  `Telefone destinatário: 
${this.state.sale.destPhone}` :
                  '---'
              }
            </Text>
          </View>
          <View style={[styles.elementRow, styles.space]}>
            <Text>
              {
                this.state.sale.address ?
                  `Morada destinatário: 
${this.state.sale.address}` :
                  '---'
              }
            </Text>
          </View>
          <View style={[styles.elementRow, styles.space]}>
            <Text>
              {
                this.state.sale.deliverDate ?
                  `Data de Entrega: 
${this.deliveryDate().getDay()} - ${this.deliveryDate().getMonth() + 1} - ${this.deliveryDate().getFullYear()}` :
                  '---'
              }
            </Text>
          </View>
          <View style={[styles.elementRow]}>
            <Text>
              {
                this.state.sale.giftMessage ?
                  `Messagem Presente:
${this.state.sale.giftMessage}` :
                  '---'
              }
            </Text>
          </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
   backgroundColor: '#fceded',
  },
  elementRow : {
   width: "100%",
   borderWidth: 1,
   borderRadius: 1,
   minHeight: 60,
   justifyContent: 'center',
   flexWrap: 'wrap',
   alignItems: "flex-start",
  },
  space : {
    marginBottom: 30
  }
})

