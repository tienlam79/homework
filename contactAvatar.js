import React from 'react';
import { View, StyleSheet, Text, Pressable, Image } from 'react-native';

const ContactAvatar = ({ contact }) => {
  const getShortName = () => {
    return `${contact?.firstName?.charAt(0)}${contact?.lastName?.charAt(0)}`;
  }
  if (contact?.imageAvailable) {
    return <View style={AvatarStyles.avatarView}>
      <Image
        source={{ uri: contact.image.uri }}
        style={AvatarStyles.imageAvatar}
      />
    </View>
  }
  return (
    <View style={AvatarStyles.avatarView}>
      <View style={[AvatarStyles.imageAvatar, AvatarStyles.shortNameView]}>
        <Text style={AvatarStyles.shortName}>{getShortName()}</Text>
      </View>
    </View>
  );
}

const AvatarStyles = StyleSheet.create({
  avatarView: {
    justifyContent:'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  shortNameView: {
    backgroundColor: 'rgba(0,0,0, 0.2)',
    justifyContent:'center',
    alignItems: 'center',
  },
  shortName: {
    fontSize: 32,
    textTransform: 'uppercase',
    textAlign: 'center'
  }
});

export default ContactAvatar;
