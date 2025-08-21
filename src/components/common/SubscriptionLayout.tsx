import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';

type Props = {
  planKey: string; // Ejemplo: 'subscription.basic'
};

const SubscriptionLayout = ({ planKey }: Props) => {
  const { t } = useTranslation();

  const title = t(`${planKey}.title`);
  const description = t(`${planKey}.description`);
  const features: string[] = t(`${planKey}.features`, { returnObjects: true });
  const buttonLabel = t(`${planKey}.button`);

  return (   
          
    <>
      <View style={styles.titleBox}> 
          <Text style={styles.titleText}>{title}</Text> 
      </View> 
      <View style={styles.descBox}> 
          <Text style={styles.descText}>{description}</Text> 

          {features.map((feature, i) => (
              <View key={i} style={styles.featureItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.featureText}>{feature}</Text>
              </View>
          ))}            
      </View>    
    </>   
  );
};

export default SubscriptionLayout;

const styles = StyleSheet.create({    
  titleBox: {
    backgroundColor: "#252A30",
    height: 54,
    alignItems: 'center', 
    justifyContent: "center",   
    marginBottom: 20,
    borderRadius: 10,
  },
  descBox:{
    height: 300,    
    paddingVertical: 25,
    paddingHorizontal: 25, 
    backgroundColor: "#252A30", 
    borderRadius: 10, 
  },

  titleText:{
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF"
  },

  descText:{
    fontSize: 16,
    fontWeight: "400",
    color: "#FFFFFF",
    marginBottom: 10,   
  },
  
  featureItem: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginTop: 2,
  },

  bullet: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 20,
    paddingRight: 6,
    paddingTop: 2,
    color: "#FFFFFF",
  },

  featureText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 20,
    color: "#FFFFFF",
  }  
});