import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Contacts from 'expo-contacts';
import ContactDetail from './contactDetail';
import ContactItem from './contactItem';
import { CONTACT_FAVORITE } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [favoritedContactId, setFavoritedContactId] = useState();
  const contactList = useRef([]);

  const contactListView = useMemo(() => {
    let results = [...contacts];
    if (favoritedContactId) {
      const favoritedContact = results.find(contact => favoritedContactId === contact?.id);
      const restContacts = results
        .filter(contact => contact?.id !== favoritedContactId)
        .map(contact => ({...contact, favorited: false }))
      results = [{...favoritedContact, favorited: true}, ...restContacts];
      contactList.current = results;
    }
    if (searchText) {
      const textSearch = searchText?.trim()?.toLocaleLowerCase();
      results = contactList?.current?.filter((contact) => {
        const isMatchPhone = contact?.phoneNumbers?.some((phone) => phone?.digits?.includes(textSearch));
        const isMatchName = contact?.name?.trim()?.toLocaleLowerCase()?.includes(textSearch);
        return isMatchName || isMatchPhone;
      });
    }
    return results;
  }, [contacts, searchText, favoritedContactId]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const id = await getFavoriteContact();
      getContacts(id);
    } catch(error) {
    }
  }

  const getFavoriteContact = async () => {
    try {
      const value = await AsyncStorage.getItem(CONTACT_FAVORITE);
      setFavoritedContactId(value);
      return value;
    } catch (e) {
    }
  }

  const getContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync();
        if (data.length > 0) {
          let results = data?.sort((a, b) => {
            if(a?.firstName < b?.firstName) { return -1; }
            if(a?.firstName > b?.firstName) { return 1; }
            return 0;
          });
          contactList.current = results;
          setContacts(results);
        }
      }
    } catch(error) {
    }
  }

  const renderEmptyList = () => {
    return <View>
      <Text style={styles.emptyText}>You don't have any contact</Text>
    </View>
  }

  if (selectedContact) {
    return <ContactDetail
      contact={selectedContact}
      onBack={() => setSelectedContact(null)}
      onRefreshList={getFavoriteContact}
    />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <SearchInput text={searchText} onChangeText={setSearchText} />
      <FlatList
        data={contactListView}
        renderItem={({ item }) => <ContactItem item={item} onSelect={() => setSelectedContact(item)} />}
        keyExtractor={(item, index) => `contact-${index}`}
        initialNumToRender={40}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  emptyText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700'
  },
  title: {
    fontSize: 24, 
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingBottom: 20
  }
});

const SearchInput = ({ onChangeText, text }) => {
  return (
    <View style={SearchInputStyles.inputView}>
      <TextInput
        style={SearchInputStyles.input}
        placeholder='Search here'
        placeholderTextColor={'rgba(0,0,0,0.5)'}
        onChangeText={onChangeText}
        value={text}
      />
    </View>
  );
}

const SearchInputStyles = StyleSheet.create({
  inputView: {
    paddingHorizontal: 20,
    marginBottom: 20
  }, 
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    fontSize: 14,
    color: '#000',
    paddingHorizontal: 16,
  }
});

export default React.memo(ContactList);
