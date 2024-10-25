import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { USE_CUSTOM_POST } from 'app/util/Hooks/PostHook'

const { width, height } = Dimensions.get('window');

export const NewAccountModal = ({ isVisible, onClose }) => {
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken } = useSequence();

  const { sendRequest, loading, error, response, LoadingComponent } = USE_CUSTOM_POST('https://api.example.com/data')


  const handleTermsLink = () => {
    Linking.openURL('https://www.termsfeed.com/live/e83ebcc4-6fe8-4881-80f8-7dfa5fd67c38');
  };

  const handlePrivacyLink = () => {
    Linking.openURL('https://www.termsfeed.com/live/b713ea15-fd91-470b-99b2-8d730147102d');
  };

  
  const handleCreateAccount = async () => {
    if (!showTerms) {
      setShowTerms(true);
    } else if (termsAccepted) {
      try {
        setIsSubmitting(true);
        const token = await getToken();
        if (!token) {
          throw new Error('No token found');
        }
        
        // await sendRequest({ token });
        console.log("token: ", token)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIsSubmitting(false);
        setShowTerms(false);
        setTermsAccepted(false);
        // onClose();
      } catch (error) {
        console.error('Error creating account:', error);
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setShowTerms(false);
    setTermsAccepted(false);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {showTerms ? 'Terms & Conditions' : 'Create New Account'}
          </Text>
          
          <ScrollView style={styles.scrollView}>
            {!showTerms ? (
              <Text style={styles.modalText}>
                It looks like you don't have an account yet. Would you like to create one?
              </Text>
            ) : (
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  Before creating your account, please review and accept our terms and policies:
                </Text>
                
                <TouchableOpacity 
                  style={styles.linkButton} 
                  onPress={handleTermsLink}
                >
                  <Text style={styles.linkText}>Terms & Conditions</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.linkButton} 
                  onPress={handlePrivacyLink}
                >
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                >
                  <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                    {termsAccepted && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <Text style={styles.checkboxText}>
                    I agree to the Terms & Conditions and Privacy Policy
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button, 
                styles.createButton,
                showTerms && !termsAccepted && styles.disabledButton
              ]}
              onPress={handleCreateAccount}
              disabled={showTerms && !termsAccepted}
            >
              <Text style={styles.buttonText}>
                {showTerms ? 'Create Account' : 'Continue'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
          {(isSubmitting || loading) && (
            <View style={styles.loadingOverlay}>
              <LoadingComponent />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  modalView: {
    width: width * 0.85,
    maxHeight: height * 0.7,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollView: {
    width: '100%',
    marginVertical: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  termsContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  termsText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  linkButton: {
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'blue',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: 'blue',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
    marginTop: 10,
  },
  button: {
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 14 : 12,
    width: '100%',
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: 'blue',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#666',
  },
});