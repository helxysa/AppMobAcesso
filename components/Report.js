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
} from "react-native";
import { Link } from "expo-router";
import { useState } from "react";

export default function Report() {
  const [modalVisible, setModalVisible] = useState(false);
  const [reportData, setReportData] = useState({
    descricao: "",
    localizacao: "",
    tipoBarreira: "",
    latitude: null,
    longitude: null,
  });

  const handleSubmitReport = () => {
    const dadosParaAPI = {
      ...reportData,
      dataReporte: new Date().toISOString(),
      status: "pendente",
    };

    console.log("Dados prontos para enviar:", dadosParaAPI);
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
        <Text style={styles.headerText}>
          Colabore com a gente, faça um reporte de acessibilidade ou de área
          inacessível
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.routePlanner}>
          <View style={styles.accessibilityPreferences}>
            <Text style={styles.preferencesTitle}>
              Clique no mapa ou insira o local para reportar
            </Text>
          </View>
        </View>

        <View style={styles.mapSection}>
          <TouchableOpacity
            style={styles.mockMap}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.mockMapText}>Área do Mapa</Text>
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
              <Text style={styles.modalTitle}>Reportar Barreira</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Localização Atual</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite a localização"
                  value={reportData.localizacao}
                  onChangeText={(text) =>
                    setReportData({ ...reportData, localizacao: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tipo de Barreira</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Descreva o tipo de barreira"
                  value={reportData.tipoBarreira}
                  onChangeText={(text) =>
                    setReportData({ ...reportData, tipoBarreira: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Descrição do Problema</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
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
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={handleSubmitReport}
                >
                  <Text style={styles.buttonText}>Enviar</Text>
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
  modalTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
    color: "#1565C0",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#424242",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
    color: "#333",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
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
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButtonText: {
    color: "#1565C0",
  },
});