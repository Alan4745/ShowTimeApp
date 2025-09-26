import React, {useState, useRef} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, 
    ScrollView, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';

export default function AccomplishmentsScreen() {
    const {t} = useTranslation();
    const {updateData} = useRegistration();
    const navigation = useNavigation();
    const [inputs, setInputs] = useState([{ id: Date.now().toString(), value: '' }]);
    const scrollRef = useRef<ScrollView>(null);

    // Agrega un nuevo campo vacío al presionar "+"
    const handleAddInput = () => {
        const lastInput = inputs[inputs.length - 1];
        if (lastInput.value.trim() === '') return; // evita agregar si el último está vacío
        setInputs([...inputs, { id: Date.now().toString() + Math.random().toString(), value: '' }]);
        setTimeout(() => {
            scrollRef.current?.scrollTo({ y: 0, animated: true }); // usamos reverse()
            // o .scrollToEnd({ animated: true }); si no se usa reverse
    }, 100);
    };

    // Maneja cambios en un input específico
    const handleInputChange = (id: string, text: string) => {
        const updated = inputs.map(input =>
            input.id === id ? { ...input, value: text } : input
        );
        setInputs(updated);
    };
    
    // Aqui agregar lógica para envio de datos
    const handleContinue = () => {
        Keyboard.dismiss();
        const nonEmpty = inputs.filter(input => input.value.trim() !== '');
        console.log('Datos enviados:', nonEmpty);  
        setInputs([{ id: Date.now().toString(), value: '' }]);  
        updateData({ accomplishments: inputs.map(input => input.value.trim()).filter(Boolean)});    
        (navigation as any).navigate('CoachSummary');
    }

    // Elimina inputs
    const handleRemoveInput = (id: string) => {
        setInputs(inputs.filter(input => input.id !== id));
    };

    // Verifica si al menos un input tiene texto
    const hasValidInput = inputs.some(input => input.value.trim().length > 0);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style = {{flex: 1}}>
                <ScreenLayout currentStep={8} totalSteps={8}>
                    <ContentContainer>
                        <ScreenTitle title={t('registration.accomplishments')}/>

                        <View style = {styles.selectorContainer}>
                            <ScrollView
                                ref={scrollRef}
                                style={styles.scrollContainer}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                keyboardShouldPersistTaps="handled"
                            >
                                {[...inputs].reverse().map(({id, value}) => (
                                    <View key={id} style={styles.inputRow}>
                                        <TextInput
                                            key={id}
                                            style={styles.inputText}
                                            placeholder={t('placeholders.accomplishmentInput')}
                                            placeholderTextColor="#FFFFFF"
                                            multiline
                                            maxLength={80}
                                            value={value}
                                            onChangeText={(text) => handleInputChange(id, text)}
                                            textAlignVertical="top"
                                        />
                                        {inputs.length > 1 && (
                                        <TouchableOpacity onPress={() => handleRemoveInput(id)} style={styles.deleteButton}>
                                            <Text style={styles.deleteButtonText}>×</Text>
                                        </TouchableOpacity>
                                        )}
                                    </View>    
                                ))}
                            </ScrollView>    

                            <TouchableOpacity
                                style={styles.addButton} 
                                onPress={handleAddInput}                   
                            >
                                <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>
                            <HelperText 
                                text={t('helperTexts.accomplishmentsHelperText')} 
                                style = {{marginTop: 20}}
                            />
                        </View>
                    </ContentContainer>

                    <BottomSection>
                        <ContinueButton
                            onPress={()=> handleContinue()}
                            disabled={!hasValidInput}
                        />
                        <HelperText text={""} />
                    </BottomSection>            
                </ScreenLayout> 
            </View>                        
        </TouchableWithoutFeedback>         
    )
}

const styles = StyleSheet.create({
    selectorContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    scrollContainer: {
        flexGrow: 0,
        maxHeight: 175, 
        marginBottom: 10,               
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,        
    },
    inputText: {
        fontFamily: 'AnonymousPro-Regular', 
        fontWeight: "400",
        fontSize: 20,
        backgroundColor: '#2B80BE',
        color: '#FFFFFF',
        paddingHorizontal: 30,               
        borderRadius: 130,
        minHeight: 80,
        maxHeight: 120,
        marginBottom: 10,
        textAlign: "center",        
        height: 98,
        width: "85%",        
    },    
    deleteButton: {
        marginLeft: 8,
        backgroundColor: '#FF5C5C',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    addButton: {
        height: 52,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 25,        
        paddingHorizontal: 20,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
    },
    addButtonText: {
        fontFamily: 'AnonymousPro-Regular',
        fontWeight: '600',        
        color: '#FFFFFF',        
        textAlign: 'center',
        fontSize: 28,
    }  
})