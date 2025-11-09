import React, {useEffect, useState} from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';

type Props = {
  visible?: boolean;
  onClose?: () => void;
  referralLink?: string;
  currentReferrals?: number;
};

export default function MyReferralsModal({
  visible = true,
  onClose,
  referralLink = 'https://showtime.app/referral/ABC123',
  currentReferrals,
}: Props) {
  const [isVisible, setIsVisible] = useState<boolean>(visible);
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const total = 100;
  const current = currentReferrals ?? 1; // default sample: 1 referido
  const progress = Math.max(
    0,
    Math.min(100, Math.round((current / total) * 100)),
  );

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  // items rendered inline in the bar; no per-item render function needed

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>COMING SOON</Text>

          <View style={styles.content}>
            <View style={styles.countRow}>
              <Text style={styles.countText}>{`${current}/${total}`}</Text>
            </View>

            <View style={styles.track}>
              <View style={[styles.fill, {width: `${progress}%`}]} />
            </View>

            <View style={styles.linkRow}>
              <Text
                style={styles.linkText}
                numberOfLines={1}
                ellipsizeMode="middle">
                {referralLink}
              </Text>
              <TouchableOpacity
                style={[styles.copyButton, styles.copyButtonDisabled]}
                disabled={true}>
                <Text style={styles.copyButtonText}>Copiar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 12,
    alignSelf: 'center',
  },
  content: {
    marginVertical: 12,
  },
  countRow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  countText: {
    color: '#CCCCCC',
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
  },
  referralsBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#111',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  track: {
    height: 18,
    backgroundColor: '#252A30',
    borderRadius: 9,
    overflow: 'hidden',
    marginVertical: 8,
  },
  fill: {
    height: '100%',
    backgroundColor: '#7ED321',
  },
  slot: {
    backgroundColor: '#2B2B2B',
    margin: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 72,
    alignItems: 'center',
  },
  slotLabel: {
    color: '#CCCCCC',
    fontFamily: 'AnonymousPro-Bold',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  linkText: {
    flex: 1,
    color: '#CCCCCC',
    marginRight: 8,
  },
  copyButton: {
    backgroundColor: '#2B80BE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyButtonDisabled: {
    backgroundColor: '#444',
    opacity: 0.6,
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    width: '45%',
    backgroundColor: '#2B80BE',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 18,
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
