import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PlanCardProps {
  title: string;
  price: string;
  description: string;
  features: PlanFeature[];
  isSelected: boolean;
  onSelect: () => void;
  isPopular?: boolean;
}

export default function PlanCard({
  title,
  price,
  description,
  features,
  isSelected,
  onSelect,
  isPopular = false,
}: PlanCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.selectedCard,
        isPopular && styles.popularCard,
      ]}
      onPress={onSelect}
    >
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={[styles.title, isSelected && styles.selectedTitle]}>
          {title}
        </Text>
        <Text style={[styles.price, isSelected && styles.selectedPrice]}>
          {price}
        </Text>
        <Text style={[styles.description, isSelected && styles.selectedDescription]}>
          {description}
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <View style={[
              styles.checkIcon,
              feature.included ? styles.includedIcon : styles.notIncludedIcon,
            ]}>
              {feature.included && (
                <Check color="#fff" size={12} strokeWidth={3} />
              )}
            </View>
            <Text style={[
              styles.featureText,
              isSelected && styles.selectedFeatureText,
              !feature.included && styles.notIncludedText,
            ]}>
              {feature.text}
            </Text>
          </View>
        ))}
      </View>

      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Check color="#4A90E2" size={20} strokeWidth={3} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
  },
  popularCard: {
    borderColor: '#FF6B6B',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  selectedTitle: {
    color: '#4A90E2',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 8,
  },
  selectedPrice: {
    color: '#4A90E2',
  },
  description: {
    fontSize: 14,
    color: '#999',
    lineHeight: 18,
  },
  selectedDescription: {
    color: '#ccc',
  },
  featuresContainer: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  includedIcon: {
    backgroundColor: '#4A90E2',
  },
  notIncludedIcon: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#555',
  },
  featureText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 18,
    flex: 1,
  },
  selectedFeatureText: {
    color: '#fff',
  },
  notIncludedText: {
    color: '#666',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
