import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from 'react-native';
import ThepeerColors from '../colors';
import { genericStyles } from '../genericStyles';
import { currencyFormatter, isIOS, resheight } from '../utils';
import ThePeerText from './ThePeerText';
import Loader from './Loader';
import SDKServices from '../services/sdkServices';
import type { BusinessType, PaneOnePropType } from '../@types';

const PaneOne = ({
  name: userFirstName,
  amount,
  handleSelectedBusiness,
}: PaneOnePropType) => {
  const [businesses, setBusinesses] = useState<BusinessType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  useEffect(() => {
    const getBusinesses = async () => {
      setIsLoading(true);
      const res = await SDKServices.getBusinessesService();
      setIsLoading(false);
      const { status, data } = res;
      if (status === 200) {
        setBusinesses(data.businesses);
      }
    };
    getBusinesses();
  }, []);

  const filteredBusinesses: BusinessType[] = businesses.filter((biz) => {
    const { name } = biz as BusinessType;
    return name.toLowerCase().includes(searchKeyword.toLowerCase());
  });

  const clearBtnRef = useRef(new Animated.Value(0)).current;
  const clearSearch = () => setSearchKeyword('');

  const pickBusiness = (business: BusinessType) => {
    Keyboard.dismiss();
    handleSelectedBusiness(business);
  };
  useEffect(() => {
    Animated.timing(clearBtnRef, {
      toValue: !searchKeyword ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [searchKeyword, clearBtnRef]);

  return (
    <KeyboardAvoidingView
      behavior={isIOS ? 'padding' : 'height'}
      style={genericStyles.flex}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View style={genericStyles.al_i_c}>
            <ThePeerText
              {...{
                text: `Hi ${
                  userFirstName.split(' ')[0]
                }, you are about to send`,
                fontSize: 14,
              }}
            />
            <ThePeerText
              {...{
                fontWeight: 'bold',
                fontSize: 32,
                color: ThepeerColors.blue2,
                text: currencyFormatter(amount),
                marginTop: 10,
              }}
            />
          </View>
          <View style={genericStyles.mt30}>
            <ThePeerText text="Select fintech" fontSize={13} />
            <View style={styles.searchInputCont}>
              <TextInput
                placeholder="Search"
                value={searchKeyword}
                style={styles.textInput}
                placeholderTextColor={ThepeerColors.blue2}
                onChangeText={(text) => setSearchKeyword(text.trim())}
              />
              <Animated.View
                style={{
                  ...styles.clearBtnCont,
                  opacity: clearBtnRef.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                  transform: [
                    {
                      translateX: clearBtnRef.interpolate({
                        inputRange: [0, 1],
                        outputRange: [+100, -10],
                      }),
                    },
                  ],
                }}
              >
                <Pressable
                  android_ripple={{ color: ThepeerColors.ripple }}
                  style={({ pressed }) => [
                    {
                      opacity: isIOS && pressed ? 0.2 : 1,
                      padding: 10,
                      backgroundColor: '#fff',
                      borderRadius: 20,
                    },
                  ]}
                  onPress={clearSearch}
                >
                  <Image
                    source={require('../assets/images/close.png')}
                    style={styles.closeImg}
                  />
                </Pressable>
              </Animated.View>
            </View>
            {isLoading ? (
              <View style={styles.loaderCont}>
                <Loader />
              </View>
            ) : (
              <ScrollView
                style={styles.list}
                keyboardShouldPersistTaps="handled"
              >
                {filteredBusinesses.length === 0 && !!searchKeyword ? (
                  <View style={[genericStyles.al_i_c]}>
                    <ThePeerText
                      {...{
                        fontSize: 12,
                        text: 'No business matches your search',
                      }}
                    />
                  </View>
                ) : (
                  <>
                    {filteredBusinesses.map((biz) => {
                      const { logo, name, id } = biz;
                      return (
                        <Pressable
                          android_ripple={{ color: ThepeerColors.ripple }}
                          style={({ pressed }) => [
                            {
                              opacity: pressed && isIOS ? 0.2 : 1,
                              ...styles.businessCont,
                            },
                          ]}
                          key={id}
                          onPress={() => pickBusiness(biz)}
                        >
                          <Image
                            source={{ uri: logo }}
                            style={styles.businessLogo}
                          />
                          <ThePeerText
                            {...{
                              fontWeight: 'bold',
                              fontSize: 16,
                              color: ThepeerColors.blue2,
                              text: name,
                            }}
                          />
                        </Pressable>
                      );
                    })}
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  searchInputCont: {
    position: 'relative',
    overflow: 'hidden',
  },
  clearBtnCont: {
    position: 'absolute',
    right: 0,
    top: 20,
  },
  closeImg: {
    width: 10,
    height: 10,
  },
  loaderCont: {
    position: 'absolute',
    top: 10,
    width: '100%',
  },
  textInput: {
    marginTop: 10,
    backgroundColor: '#F7F7F7',
    borderRadius: 6,
    height: 50,
    paddingHorizontal: 18,
  },
  businessCont: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F8FD',
  },
  businessLogo: {
    width: 28,
    height: 28,
    marginRight: 20,
  },
  list: {
    marginTop: 20,
    height: resheight(45),
    position: 'relative',
  },
});

export default PaneOne;
