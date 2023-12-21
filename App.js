import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Touchable, TouchableOpacity, Keyboard } from 'react-native';
import { PickerItem } from './src/Picker'
import { api } from './src/services/api'

export default function App() {
  const [moedas, setMoedas] = useState([])
  const [loading, setLoading] = useState(true);
  const [selectMoeda, setSelectMoeda] = useState(null)
  const [moedaBValor, setMoedaBValor] = useState("");
  
  const [valorMoeda, setValorMoeda] = useState(null)
  const [valorConvertido, setValorConvertido] = useState(0);

  useEffect(() => {
    async function loadMoedas() {
      const response = await api.get("all")
      let arrayMoedas = [];
      Object.keys(response.data).map((key) => {
        arrayMoedas.push({
          key: key,
          label: key,
          value: key,
        })
      })

      setMoedas(arrayMoedas)
      setSelectMoeda(arrayMoedas[0].key)
      setLoading(false);


    }

    loadMoedas();
  }, [])


     async function converter (){
    if(moedaBValor === 0  || moedaBValor === "" || selectMoeda === null ){
        return;
      }
      const response = await  api.get(`/all/${selectMoeda}-BRL`)

      let resultado = (response.data[selectMoeda].ask * parseFloat(moedaBValor))

      setValorConvertido(`${resultado.toLocaleString("pt-BR",{style: "currency", currency: "BRL"})}`)
      setValorMoeda(moedaBValor)
      Keyboard.dismiss();
     

    }



  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#101215" }}>
        <ActivityIndicator color="#FFF" size="small" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.areaMoeda}>
        <Text style={styles.titulo}>Selecione sua moeda</Text>
        <PickerItem
          moedas={moedas}
          moedaSelect={selectMoeda}
          onChange={(moeda) => {
            setSelectMoeda(moeda)


          }}
        />
      </View>
      <View style={styles.areaValor}>
        <Text style={styles.titulo}> Digite um valor para a conversão</Text>
        <TextInput
          placeholder='Ex: 1,50'
          style={styles.areaInput}
          keyboardType="numeric"
          value={moedaBValor}
          onChangeText={(valor) => setMoedaBValor(valor)}
        />
      </View>
      <TouchableOpacity style={styles.botaoArea} onPress={converter}>
        <Text styles={styles.botaoText}>Converter</Text>
      </TouchableOpacity>
      
      
      {valorConvertido !== 0 && (
        <View style={styles.areaResultado}>
        <Text style={styles.valorConvertido}>
         {valorMoeda}   {selectMoeda}
        </Text>
        <Text style={{fontSize:18, margin: 8, fontWeight:'500', color:"#000"}}>
         Corresponde a :
        </Text>
        <Text style={styles.valorConvertido}>
         {valorConvertido}
        </Text>
  
       </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101215",
    paddingTop: 60,
    alignItems: 'center'
  },
  areaMoeda: {
    backgroundColor: "#f9f9f9",
    width: "90%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 5
  },
  titulo: {
    fontSize: 16,
    color: "#000",
    fontWeight: '500',
    paddingLeft: 3,
    paddingTop: 3,
  },
  areaValor: {
    width: '90%',
    backgroundColor: "#f9f9f9",
    paddingTop: 8,
    paddingBottom: 8,
  },
  areaInput: {
    width: '100%',
    padding: 8,
    fontSize: 18,
    color: '#000'
  },
  botaoArea: {
    width: '90%',
    backgroundColor: '#fb4b57',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  botaoText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  },
  areaResultado:{
    width:'90%',
    backgroundColor: "#FFF",
    marginTop:34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent :" center",
    padding:24,
  },
  valorConvertido:{
    fontSize:28,
    color:"#000",
    fontWeight:'bold'
  }


})