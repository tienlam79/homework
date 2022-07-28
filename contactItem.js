import React, { memo } from 'react';
import {  Pressable, StyleSheet, Text,View, Image } from 'react-native';
import StarIcon from './assets/icons/star-favorited.png';

const ContactItem = ({ item, onSelect }) => {
  return (
    <Pressable style={styles.itemView} onPress={onSelect}>
      {item?.favorited && <Image source={StarIcon} style={styles.itemIcon} />}
      <Text style={styles.itemName}>{item?.name}</Text>
    </Pressable>
  );  
}

export default memo(ContactItem);

const styles = StyleSheet.create({
  itemView: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemIcon: {
    width: 16,
    height: 16,
  }
});