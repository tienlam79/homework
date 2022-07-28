import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, Image, FlatList, ScrollView, Linking } from 'react-native';
import ContactAvatar from './contactAvatar';
import EmptyStarIcon from './assets/icons/star-empty.png';
import StarIcon from './assets/icons/star-favorited.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONTACT_FAVORITE } from './constants';

const ContactDetail = ({ contact, onBack, onRefreshList }) => {
  console.log('...contact..', contact);

  const onOpenEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  }

  const onOpenLink = (url) => {
    Linking.openURL(url);
  }

  const onCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  }
  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <ContactAvatar contact={contact} />
        <View style={styles.contactHeader}>
          <Text style={styles.contactName}>{contact.name}</Text>
          {!!contact.company && <Text style={styles.contactCompany}>{contact.company}</Text>}
        </View>
        <ContactActions contact={contact} onRefreshList={onRefreshList} />
        <ContactInfo
          data={contact?.emails}
          type='email'
          renderItem={({ item }) => <ContactDetailItem label={item.label} value={item.email} onPressValue={onOpenEmail} />}
        />
        <ContactInfo
          data={contact?.phoneNumbers}
          type='phone'
          renderItem={({ item }) => <ContactDetailItem label={item.label} value={item.digits} onPressValue={onCall} />}
        />
        <ContactInfo
          data={contact?.urlAddresses}
          type='urlAddresses'
          renderItem={({ item }) => <ContactDetailItem label={item.label} value={item.url} onPressValue={onOpenLink} />}
        />
        <ContactInfo
          data={contact?.addresses}
          type='addresses'
          renderItem={({ item }) => <ContactDetailAddressItem label={item.label} address={item} />}
        />
        {(contact?.birthday !== undefined || contact?.nonGregorianBirthday != undefined) &&
          <ContactInfo
            data={[contact?.birthday, contact?.nonGregorianBirthday]}
            type='birthday'
            renderItem={({ item }) => <ContactDetailItem label={item.format} value={`${item.day}/${item.month}/${item.year}`} />}
          />
        }
        <ContactInfo
          data={contact?.dates}
          type='dates'
          renderItem={({ item }) => <ContactDetailItem label={item.label} value={`${item.day || ''}/${item.month || ''}${item.year ? '/' : ''}${item.year || ''}`} />}
        />
        <ContactInfo
          data={contact?.relationships}
          type='relationships'
          renderItem={({ item }) => <ContactDetailItem label={item.label} value={`${item.name}`} />}
        />
        <ContactInfo
          data={contact?.instantMessageAddresses}
          type='instantMessageAddresses'
          renderItem={({ item }) => <ContactDetailItem label={item.label} value={`${item.username}`} />}
        />
      </ScrollView>
    </View>
  );
}

const styles =  StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1
  },
  contactName: {
  },
  contactHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40
  },
  backText: {
    fontSize: 16,
    fontWeight: '700'
  },
  backBtn: {
    height: 50
  },
  contactName: {
    fontSize: 16
  },
  contactCompany: {
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
  }
});

export default ContactDetail;

const ContactActionItemStyles = StyleSheet.create({
  itemView: {
    height: 70,
    width: 100, 
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 4
  },
  itemLabel: {
    fontWeight: '500'
  },
  itemIcon: {
    width: 24,
    height: 24
  }
});

const ContactActions = ({ contact, onRefreshList }) => {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    getFavoriteContact();
  }, []);

  const openEmail = () => {
    const defaultEmail = contact.emails?.[0];
    if(defaultEmail) {
      Linking.openURL(`mailto:${defaultEmail?.email}`);
    }
  }

  const onFavorite = () => {
    const value = !favorited;
    setFavorited(value);
    storeFavoriteContact(value ? contact?.id : '');
    onRefreshList?.();
  }

  const storeFavoriteContact = async (contactId) => {
    try {
      await AsyncStorage.setItem(CONTACT_FAVORITE, contactId);
    } catch (e) {
    }
  }

  const getFavoriteContact = async () => {
    try {
      const favoritedContactId = await AsyncStorage.getItem(CONTACT_FAVORITE);
      if (favoritedContactId) {
        setFavorited(favoritedContactId === contact?.id);
      }
    } catch (e) {
    }
  }

  const onCall = () => {
    const defaultPhone = contact?.phoneNumbers?.[0];
    if (defaultPhone) {
      Linking.openURL(`tel:${defaultPhone.digits}`);
    }
  }

  const onMessage = () => {
    const defaultPhone = contact?.phoneNumbers?.[0];
    if (defaultPhone) {
      Linking.openURL(`sms:${defaultPhone.digits}`);
    }
  }

  return (
    <View style={{ flexDirection: 'row', marginHorizontal: -4, marginBottom: 20 }}>
      <ContactActionItem
        label={'Favorite'}
        icon={favorited ? StarIcon : EmptyStarIcon}
        onPress={onFavorite}
      />
      {!!contact.phoneNumbers && <ContactActionItem
        onPress={onCall}
        label={'Call'}
      />}
      {!!contact.phoneNumbers && <ContactActionItem label={'Message'}  onPress={onMessage} />}
      {!!contact.emails && <ContactActionItem label={'Email'} onPress={openEmail} />}
    </View>
  );
};

const ContactActionItem = ({ label, icon, onPress }) => {
  return (
    <Pressable style={ContactActionItemStyles.itemView} onPress={onPress}>
      {icon && <Image source={icon} style={ContactActionItemStyles.itemIcon} />}
      <Text style={ContactActionItemStyles.itemLabel}>{label}</Text>
    </Pressable>
  );
}

const ContactInfo = ({ data, renderItem, type }) => {
  if (!data) {
    return <View />
  }
  return (
    <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 8, padding: 16, marginBottom: 10 }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => `contact-${type}-${index}`}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={ContactInfoStyles.dividedLine} />}
      />
    </View>
  );
};

const ContactInfoStyles = StyleSheet.create({
  dividedLine: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 10
  }
});

const ContactDetailItem = ({ label, value, onPressValue }) => {
  return (
    <View style={ContactDetailItemStyles.itemView}>
      <Text style={ContactDetailItemStyles.itemLabel}>{label}</Text>
      <Pressable onPress={() => onPressValue?.(value)}>
        <Text style={ContactDetailItemStyles.itemValue}>{value}</Text>
      </Pressable>
    </View>
  );
}

const ContactDetailAddressItem = ({ label, address }) => {
  return (
    <View style={ContactDetailItemStyles.itemView}>
      <Text style={ContactDetailItemStyles.itemLabel}>{label}</Text>
      <Text style={ContactDetailItemStyles.itemValue}>{address?.street}</Text>
      <Text style={ContactDetailItemStyles.itemValue}>{address?.region}</Text>
      <Text style={ContactDetailItemStyles.itemValue}>{address?.city}</Text>
      <Text style={ContactDetailItemStyles.itemValue}>{address?.country}</Text>
      <Text style={ContactDetailItemStyles.itemValue}>{address?.postalCode}</Text>
    </View>
  );
}

const ContactDetailItemStyles = StyleSheet.create({
  itemLabel: {
    color: 'rgba(0,0,0,0.6)',
  },
  itemValue: {
    fontWeight: '500',
    color: 'blue',
    lineHeight: 24
  }
});
