import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import SubscriptionLayout from "../components/common/SubscriptionLayout";
import ScreenLayout from "../components/common/ScreenLayout";
import ContentContainer from "../components/common/ContentContainer";
import ScreenTitle from "../components/common/ScreenTitle";
import BottomSection from '../components/common/BottomSection';

export default function SubscribePremiumScreen() {
  const { t } = useTranslation();
  
  return (
    <ScreenLayout>
      <ContentContainer>
              <ScreenTitle title={t('subscription.title')} />
              <SubscriptionLayout planKey="subscription.premium" />
            </ContentContainer>

            <BottomSection>
              <TouchableOpacity style={styles.subscribeButton} onPress={() => {}}>
                <Text style={styles.subscribeButtonText}>
                  {t('subscription.premium.button')}
                </Text>
              </TouchableOpacity>
            </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  subscribeButton: {
    width: 282,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 32,
    alignItems: 'center', 
    marginBottom: 10,  
  },
  
  subscribeButtonText: {
    fontFamily: 'AnonymousPro-Regular',
    color: '#2B80BE',
    fontWeight: '700',
    fontSize: 18,
  },
});
