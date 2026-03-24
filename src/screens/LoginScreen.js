import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../navigation/AuthContext';
import { useLang } from '../navigation/LangContext';

const C = {
  primary: '#1B2A4A', accent: '#4A90D9', gold: '#F5C518',
  bg: '#F0F4FF', card: '#fff', text: '#1a1a2e', light: '#8892b0',
  error: '#e74c3c', success: '#27ae60',
};

function InputField({ icon, placeholder, value, onChangeText, secure, keyboardType }) {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.inputWrap}>
      <Ionicons name={icon} size={18} color={C.accent} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={C.light}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure && !show}
        keyboardType={keyboardType || 'default'}
        autoCapitalize="none"
      />
      {secure && (
        <TouchableOpacity onPress={() => setShow(!show)} style={styles.eyeBtn}>
          <Ionicons name={show ? 'eye' : 'eye-off'} size={18} color={C.light} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t, lang, setLang } = useLang();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Ýalňyşlyk', 'Ähli meýdanlary dolduryň');
      return;
    }
    setLoading(true);
    const res = await login(username.trim(), password);
    setLoading(false);
    if (!res.success) Alert.alert('Ýalňyşlyk', res.error);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[C.primary, '#0f1d35', '#1a2a5e']} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Lang switcher */}
          <View style={styles.langBar}>
            {['tk','ru','en'].map(l => (
              <TouchableOpacity key={l} onPress={() => setLang(l)} style={[styles.langBtn, lang===l && styles.langActive]}>
                <Text style={[styles.langText, lang===l && styles.langTextActive]}>{l.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logo */}
          <View style={styles.logoBox}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>📘</Text>
            </View>
            <Text style={styles.logoTitle}>Inlis Dili TM</Text>
            <Text style={styles.logoSub}>{t.subtitle}</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t.login}</Text>

            <InputField icon="person-outline" placeholder={t.username} value={username} onChangeText={setUsername} />
            <InputField icon="lock-closed-outline" placeholder={t.password} value={password} onChangeText={setPassword} secure />

            <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleLogin} disabled={loading}>
              <LinearGradient colors={['#4A90D9', '#1B2A4A']} style={styles.btnGrad} start={{x:0,y:0}} end={{x:1,y:0}}>
                <Text style={styles.btnText}>{loading ? '...' : t.login}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.row}>
              <Text style={styles.switchText}>{t.noAccount} </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.switchLink}>{t.register}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.hint}>Admin: admin / admin123</Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

// ── Register Screen ──────────────────────────────────────────────
export function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ name:'', surname:'', username:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t, lang, setLang } = useLang();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleRegister = async () => {
    if (!form.name || !form.username || !form.password) {
      Alert.alert('Ýalňyşlyk', 'Ähli hökman meýdanlary dolduryň'); return;
    }
    if (form.password.length < 4) {
      Alert.alert('Ýalňyşlyk', 'Açar sözi azyndan 4 harp bolmaly'); return;
    }
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (!res.success) Alert.alert('Ýalňyşlyk', res.error);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[C.primary, '#0f1d35', '#1a2a5e']} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <View style={styles.langBar}>
            {['tk','ru','en'].map(l => (
              <TouchableOpacity key={l} onPress={() => setLang(l)} style={[styles.langBtn, lang===l && styles.langActive]}>
                <Text style={[styles.langText, lang===l && styles.langTextActive]}>{l.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.logoBox}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>📘</Text>
            </View>
            <Text style={styles.logoTitle}>Inlis Dili TM</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t.register}</Text>

            <InputField icon="person-outline" placeholder={t.name + ' *'} value={form.name} onChangeText={v=>set('name',v)} />
            <InputField icon="person-outline" placeholder={t.surname} value={form.surname} onChangeText={v=>set('surname',v)} />
            <InputField icon="at-outline" placeholder={t.username + ' *'} value={form.username} onChangeText={v=>set('username',v)} />
            <InputField icon="mail-outline" placeholder={t.email} value={form.email} onChangeText={v=>set('email',v)} keyboardType="email-address" />
            <InputField icon="lock-closed-outline" placeholder={t.password + ' *'} value={form.password} onChangeText={v=>set('password',v)} secure />

            <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleRegister} disabled={loading}>
              <LinearGradient colors={['#27ae60', '#1a7a45']} style={styles.btnGrad} start={{x:0,y:0}} end={{x:1,y:0}}>
                <Text style={styles.btnText}>{loading ? '...' : t.register}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.row}>
              <Text style={styles.switchText}>{t.hasAccount} </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.switchLink}>{t.login}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  langBar: { flexDirection:'row', justifyContent:'flex-end', gap:6, paddingTop: 50, marginBottom: 20 },
  langBtn: { paddingHorizontal:12, paddingVertical:5, borderRadius:20, borderWidth:1, borderColor:'rgba(255,255,255,.2)' },
  langActive: { backgroundColor: C.gold, borderColor: C.gold },
  langText: { color:'rgba(255,255,255,.6)', fontSize:11, fontWeight:'700' },
  langTextActive: { color: C.primary },
  logoBox: { alignItems:'center', marginBottom: 30 },
  logoCircle: { width:80, height:80, borderRadius:40, backgroundColor:'rgba(255,255,255,.1)', alignItems:'center', justifyContent:'center', marginBottom:14, borderWidth:2, borderColor:'rgba(74,144,217,.5)' },
  logoEmoji: { fontSize:38 },
  logoTitle: { fontSize:26, fontWeight:'800', color:'#fff', letterSpacing:1 },
  logoSub: { fontSize:13, color:'rgba(255,255,255,.5)', marginTop:4 },
  card: { backgroundColor: C.card, borderRadius:20, padding:24, shadowColor:'#000', shadowOffset:{width:0,height:8}, shadowOpacity:0.25, shadowRadius:16, elevation:12 },
  cardTitle: { fontSize:22, fontWeight:'800', color:C.text, marginBottom:20, textAlign:'center' },
  inputWrap: { flexDirection:'row', alignItems:'center', backgroundColor:'#f5f7ff', borderRadius:12, marginBottom:14, paddingHorizontal:14, borderWidth:1, borderColor:'#e0e8ff' },
  inputIcon: { marginRight:10 },
  input: { flex:1, paddingVertical:13, fontSize:14, color:C.text },
  eyeBtn: { padding:6 },
  btn: { borderRadius:12, overflow:'hidden', marginTop:8, marginBottom:16 },
  btnDisabled: { opacity:0.6 },
  btnGrad: { paddingVertical:14, alignItems:'center' },
  btnText: { color:'#fff', fontSize:15, fontWeight:'800', letterSpacing:.5 },
  row: { flexDirection:'row', justifyContent:'center', alignItems:'center' },
  switchText: { color:C.light, fontSize:13 },
  switchLink: { color:C.accent, fontSize:13, fontWeight:'700' },
  hint: { textAlign:'center', color:'rgba(255,255,255,.3)', fontSize:11, marginTop:20 },
});
