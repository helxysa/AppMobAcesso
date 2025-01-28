import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { useDynamicStyles } from '../utils/useDynamicStyles';
import * as FileSystem from 'expo-file-system';
import formularioBarreira from '../assets/data/formulario_barreira.json';

export default function Report() {
  const [modalVisible, setModalVisible] = useState(false);
  const [reportData, setReportData] = useState({
    descricao: "",
    localizacao: "",
    tipoBarreira: "",
    latitude: null,
    longitude: null,
  });

  const dynamicStyles = useDynamicStyles({
    headerText: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#333",
    },
    preferencesTitle: {
      fontSize: 22,
      fontWeight: "600",
      color: "#333",
    },
    mockMapText: {
      fontSize: 20,
      color: "#666",
    },
    modalTitle: {
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 25,
      textAlign: "center",
      color: "#1565C0",
    },
    inputLabel: {
      fontSize: 20,
      marginBottom: 8,
      color: "#424242",
      fontWeight: "600",
    },
    input: {
      fontSize: 18,
      color: "#333",
    },
    buttonText: {
      color: "#fff",
      textAlign: "center",
      fontSize: 18,
      fontWeight: "700",
    },
    cancelButtonText: {
      color: "#1565C0",
      fontSize: 18,
      fontWeight: "700",
    },
  });

  const saveReportToLocal = async (reportData) => {
    try {
      // Lê o conteúdo atual do arquivo
      let existingData = formularioBarreira || [];

      // Adiciona o novo reporte
      existingData.push(reportData);

      // Aqui você pode:
      // 1. Enviar os dados para uma API que atualize o arquivo no projeto
      // 2. Ou usar uma solução de armazenamento local como AsyncStorage
      console.log('Dados a serem salvos:', JSON.stringify(existingData, null, 2));

      Alert.alert(
        "Sucesso",
        "Reporte registrado com sucesso!",
        [{ text: "OK" }]
      );

    } catch (error) {
      console.error('Erro ao salvar o reporte:', error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar o reporte. Tente novamente.",
        [{ text: "OK" }]
      );
    }
  };

  const handleSubmitReport = async () => {
    const dadosParaAPI = {
      ...reportData,
      dataReporte: new Date().toISOString(),
      status: "pendente",
    };

    await saveReportToLocal(dadosParaAPI);
    
    setModalVisible(false);
    setReportData({
      descricao: "",
      localizacao: "",
      tipoBarreira: "",
      latitude: null,
      longitude: null,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={dynamicStyles.headerText}>
          Colabore com a gente, faça um reporte de acessibilidade ou de área
          inacessível
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.routePlanner}>
          <View style={styles.accessibilityPreferences}>
            <Text style={dynamicStyles.preferencesTitle}>
              Clique no mapa ou insira o local para reportar
            </Text>
          </View>
        </View>

        <View style={styles.mapSection}>
          <TouchableOpacity
            style={styles.mockMap}
            onPress={() => setModalVisible(true)}
          >
            <Text style={dynamicStyles.mockMapText}>Área do Mapa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIndicator} />
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={dynamicStyles.modalTitle}>Reportar Barreira</Text>

              <View style={styles.inputGroup}>
                <Text style={dynamicStyles.inputLabel}>Localização Atual</Text>
                <TextInput
                  style={[styles.input, dynamicStyles.input, styles.inputStyle]}
                  placeholder="Digite a localização"
                  value={reportData.localizacao}
                  onChangeText={(text) =>
                    setReportData({ ...reportData, localizacao: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={dynamicStyles.inputLabel}>Tipo de Barreira</Text>
                <TextInput
                  style={[styles.input, dynamicStyles.input]}
                  placeholder="Descreva o tipo de barreira"
                  value={reportData.tipoBarreira}
                  onChangeText={(text) =>
                    setReportData({ ...reportData, tipoBarreira: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={dynamicStyles.inputLabel}>Descrição do Problema</Text>
                <TextInput
                  style={[styles.input, styles.textArea, dynamicStyles.input]}
                  placeholder="Descreva o problema em detalhes"
                  multiline
                  numberOfLines={4}
                  value={reportData.descricao}
                  onChangeText={(text) =>
                    setReportData({ ...reportData, descricao: text })
                  }
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={dynamicStyles.cancelButtonText}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={handleSubmitReport}
                >
                  <Text style={dynamicStyles.buttonText}>Enviar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
  },
  routePlanner: {
    padding: 20,
  },
  accessibilityPreferences: {
    marginTop: 20,
  },
  preferencesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  mapSection: {
    flex: 1,
    padding: 20,
  },
  mockMap: {
    height: 300,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  mockMapText: {
    fontSize: 18,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    paddingTop: 15,
    width: "100%",
    minHeight: "70%",
    maxHeight: "90%",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  modalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  inputStyle: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: Platform.OS === 'ios' ? 35 : 25,
    gap: 15,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#1565C0",
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButton: {
    backgroundColor: "#1565C0",
  },
  input: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});