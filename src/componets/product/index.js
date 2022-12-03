import React from 'react';
import { Text, View, Image, Button } from 'react-native';

function Product({ product }) {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          marginTop: 10,
          borderBottomColor: '#dfe4ea',
          borderBottomWidth: 1,
          paddingVertical: 10,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, paddingHorizontal: 8 }}>
            <Image
              style={{ width: 100, height: 100, resizeMode: 'center' }}
              source={{ uri: product.img }}
            />
          </View>
          <View style={{ flex: 2 }}>
            <View>
              <Text style={{ fontWeight:'bold', color:'black', fontSize:20 }}>{product.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: '#111', marginRight: 8, fontSize: 16, }} >
                    Cantidad: {product.quantity}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: '#111', marginRight: 8, fontSize: 16, }} >
                    Codigo de barras: {product.barcode}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
}

export default Product;