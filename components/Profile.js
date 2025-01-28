import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useFontSize } from '../contexts/FontSizeContext';

export default function Profile() {
  const { increaseFontSize, decreaseFontSize } = useFontSize();

  return (
    <View style={styles.container}>
     
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar} />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Text style={styles.editAvatarText}>Editar foto</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>João Silva</Text>
              <Text style={styles.userEmail}>joao.silva@email.com</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput 
                style={styles.input}
                placeholder="Seu nome"
                value="João Silva"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput 
                style={styles.input}
                placeholder="Seu e-mail"
                value="joao.silva@email.com"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone</Text>
              <TextInput 
                style={styles.input}
                placeholder="Seu telefone"
                value="(11) 98765-4321"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferências de Acessibilidade</Text>
            <View style={styles.preferencesGrid}>
              <TouchableOpacity style={[styles.preferenceItem, styles.preferenceActive]}>
                <Text style={styles.preferenceText}>Rampa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.preferenceItem}>
                <Text style={styles.preferenceText}>Elevador</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.preferenceItem}>
                <Text style={styles.preferenceText}>Piso Tátil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.preferenceItem}>
                <Text style={styles.preferenceText}>Áudio Descrição</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configurações</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Notificações</Text>
              <TouchableOpacity style={styles.toggle}>
                <View style={styles.toggleCircle} />
              </TouchableOpacity>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Alto Contraste</Text>
              <TouchableOpacity style={styles.toggle}>
                <View style={styles.toggleCircle} />
              </TouchableOpacity>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Tamanho da Fonte</Text>
              <View style={styles.fontSizeButtons}>
                <TouchableOpacity 
                  style={styles.fontSizeBtn}
                  onPress={decreaseFontSize}
                  accessibilityLabel="Diminuir tamanho da fonte"
                >
                  <Text>A-</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.fontSizeBtn}
                  onPress={increaseFontSize}
                  accessibilityLabel="Aumentar tamanho da fonte"
                >
                  <Text>A+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  accessibilityButton: {
    backgroundColor: '#0066CC',
    padding: 10,
    borderRadius: 8,
  },
  accessibilityButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    marginRight: 20,
  },
  editAvatarButton: {
    marginTop: 8,
  },
  editAvatarText: {
    color: '#0066CC',
    fontSize: 14,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  preferenceItem: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  preferenceActive: {
    backgroundColor: '#0066CC',
  },
  preferenceText: {
    color: '#333',
    fontSize: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    padding: 2,
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
  },
  fontSizeButtons: {
    flexDirection: 'row',
  },
  fontSizeBtn: {
    padding: 8,
    marginLeft: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});