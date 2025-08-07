import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Card, 
  Avatar, 
  List, 
  Switch, 
  Button,
  Divider 
} from 'react-native-paper';
import { useTheme } from '../theme';

const ProfileScreen = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [notifications, setNotifications] = React.useState(true);
  const [autoBackup, setAutoBackup] = React.useState(true);

  const dynamicStyles = StyleSheet.create({
    ...styles,
    container: {
      ...styles.container,
      backgroundColor: colors.background,
    },
    card: {
      ...styles.card,
      backgroundColor: colors.surface,
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Profil Bilgileri */}
      <Card style={dynamicStyles.card}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Text 
              size={80} 
              label="DK"
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text variant="headlineSmall" style={styles.name}>
                Demo Kullanıcı
              </Text>
              <Text variant="bodyLarge" style={styles.email}>
                demo@taskmaster.com
              </Text>
              <Text variant="bodyMedium" style={styles.memberSince}>
                Üye olma tarihi: Ocak 2024
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* İstatistikler */}
      <Card style={dynamicStyles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            📊 Genel İstatistikler
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={[styles.statNumber, {color: '#4CAF50'}]}>
                47
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Tamamlanan Görev
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={[styles.statNumber, {color: '#6200EE'}]}>
                25
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Pomodoro Oturumu
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={[styles.statNumber, {color: '#2196F3'}]}>
                12
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Toplam Not
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Ayarlar */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            ⚙️ Ayarlar
          </Text>
          
          <List.Item
            title="Karanlık Tema"
            description="Gece modunu etkinleştir"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Bildirimler"
            description="Push bildirimlerini al"
            left={props => <List.Icon {...props} icon="bell-outline" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Otomatik Yedekleme"
            description="Verilerinizi otomatik yedekle"
            left={props => <List.Icon {...props} icon="cloud-upload-outline" />}
            right={() => (
              <Switch
                value={autoBackup}
                onValueChange={setAutoBackup}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Hesap İşlemleri */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            👤 Hesap
          </Text>
          
          <List.Item
            title="Profili Düzenle"
            description="Kişisel bilgilerinizi güncelleyin"
            left={props => <List.Icon {...props} icon="account-edit" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          
          <Divider />
          
          <List.Item
            title="Şifre Değiştir"
            description="Hesap güvenliğinizi artırın"
            left={props => <List.Icon {...props} icon="lock-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          
          <Divider />
          
          <List.Item
            title="Verileri Dışa Aktar"
            description="Tüm verilerinizi indirin"
            left={props => <List.Icon {...props} icon="download" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </Card.Content>
      </Card>

      {/* Hakkında */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            ℹ️ Hakkında
          </Text>
          
          <List.Item
            title="Uygulama Versiyonu"
            description="v1.0.0"
            left={props => <List.Icon {...props} icon="information-outline" />}
          />
          
          <Divider />
          
          <List.Item
            title="Gizlilik Politikası"
            left={props => <List.Icon {...props} icon="shield-account" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          
          <Divider />
          
          <List.Item
            title="Kullanım Koşulları"
            left={props => <List.Icon {...props} icon="file-document-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </Card.Content>
      </Card>

      {/* Çıkış */}
      <Card style={[styles.card, styles.logoutCard]}>
        <Card.Content>
          <Button
            mode="outlined"
            icon="logout"
            onPress={() => {}}
            style={styles.logoutButton}
            textColor="#F44336"
          >
            Çıkış Yap
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#6200EE',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#666',
    marginBottom: 4,
  },
  memberSince: {
    color: '#999',
    fontSize: 12,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
  },
  logoutCard: {
    borderColor: '#F44336',
    borderWidth: 1,
  },
  logoutButton: {
    borderColor: '#F44336',
  },
  bottomSpace: {
    height: 32,
  },
});

export default ProfileScreen;
