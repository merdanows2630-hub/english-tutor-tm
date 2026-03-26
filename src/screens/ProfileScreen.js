import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  StatusBar, TextInput, Alert, Modal, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../navigation/AuthContext';
import { useLang } from '../navigation/LangContext';
import { WORDS } from '../data/words';
 
const C = { primary:'#1B2A4A', accent:'#4A90D9', gold:'#F5C518', bg:'#F0F4FF', card:'#fff', text:'#1a1a2e', light:'#8892b0', err:'#e74c3c' };
 
export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const { t, lang, setLang } = useLang();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name||'', surname: user?.surname||'', email: user?.email||'' });
  const [saving, setSaving] = useState(false);
 
  const favCount = user?.favorites?.length || 0;
  const score = user?.score || 0;
  const level = score >= 500 ? t.advanced : score >= 200 ? t.intermediate : t.beginner;
  const levelColor = score >= 500 ? '#e74c3c' : score >= 200 ? '#e67e22' : '#27ae60';
 
  const save = async () => {
    setSaving(true);
    await updateUser(user.id, form);
    setSaving(false);
    setEditing(false);
  };
 
  const handleLogout = () => {
    Alert.alert('Çykmak', 'Hasapdan çykmak isleýärsiňizmi?', [
      { text: 'Ýok', style:'cancel' },
      { text: 'Hawa', style:'destructive', onPress: logout },
    ]);
  };
 
  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <LinearGradient colors={[C.primary,'#0f1d35']} style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTxt}>{(user?.name||user?.username||'?')[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{user?.name} {user?.surname}</Text>
        <Text style={styles.userHandle}>@{user?.username}</Text>
        <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
          <Text style={styles.levelBadgeTxt}>⭐ {score} bal · {level}</Text>
        </View>
      </LinearGradient>
 
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          {[
            { label:'⭐ Bal', value: score, color: C.gold },
            { label:'❤️ Saýlanan', value: favCount, color:'#e74c3c' },
            { label:'📚 Söz', value: WORDS.length, color: C.accent },
          ].map((s,i) => (
            <View key={i} style={[styles.statCard, { borderTopColor: s.color }]}>
              <Text style={[styles.statNum, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLbl}>{s.label}</Text>
            </View>
          ))}
        </View>
 
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌍 Dil saýla</Text>
          <View style={styles.langRow}>
            {[
              { key:'tk', label:'🇹🇲 Türkmençe' },
              { key:'ru', label:'🇷🇺 Русский' },
              { key:'en', label:'🇬🇧 English' },
            ].map(l => (
              <TouchableOpacity key={l.key} onPress={() => setLang(l.key)}
                style={[styles.langBtn, lang===l.key && styles.langBtnActive]}>
                <Text style={[styles.langBtnTxt, lang===l.key && styles.langBtnTxtActive]}>{l.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
 
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👤 Maglumatlar</Text>
            <TouchableOpacity onPress={() => setEditing(!editing)}>
              <Text style={styles.editLink}>{editing ? 'Ýap' : 'Üýtget'}</Text>
            </TouchableOpacity>
          </View>
 
          {editing ? (
            <View style={styles.editForm}>
              {[
                { key:'name', label:t.name, icon:'person-outline' },
                { key:'surname', label:t.surname, icon:'person-outline' },
                { key:'email', label:t.email, icon:'mail-outline' },
              ].map(f => (
                <View key={f.key} style={styles.inputWrap}>
                  <Ionicons name={f.icon} size={16} color={C.accent} style={{ marginRight:8 }} />
                  <TextInput
                    style={styles.input}
                    placeholder={f.label}
                    placeholderTextColor={C.light}
                    value={form[f.key]}
                    onChangeText={v => setForm(prev => ({ ...prev, [f.key]: v }))}
                  />
                </View>
              ))}
              <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
                <LinearGradient colors={['#27ae60','#1a7a45']} style={styles.saveBtnGrad}>
                  <Text style={styles.saveBtnTxt}>{saving ? '...' : '✅ ' + t.save}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.infoCards}>
              {[
                { icon:'📛', label:t.name, value: `${user?.name||''} ${user?.surname||''}`.trim() || '—' },
                { icon:'📧', label:t.email, value: user?.email || '—' },
                { icon:'👤', label:t.username, value: user?.username },
                { icon:'🔑', label:'Rol', value: user?.role === 'admin' ? '👑 Admin' : '👤 Ulanyjy' },
              ].map((r,i) => (
                <View key={i} style={styles.infoRow}>
                  <Text style={styles.infoIcon}>{r.icon}</Text>
                  <View>
                    <Text style={styles.infoLabel}>{r.label}</Text>
                    <Text style={styles.infoVal}>{r.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
 
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={C.err} />
          <Text style={styles.logoutTxt}>{t.logout}</Text>
        </TouchableOpacity>
 
        <View style={{ height:30 }} />
      </ScrollView>
    </View>
  );
}
 
export function AdminScreen() {
  const { users, updateUser, deleteUser } = useAuth();
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
 
  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    (u.name||'').toLowerCase().includes(search.toLowerCase())
  );
 
  const openEdit = (u) => { setEditForm({ name:u.name||'', email:u.email||'', score: String(u.score||0) }); setEditModal(u); };
 
  const saveEdit = async () => {
    await updateUser(editModal.id, { ...editForm, score: parseInt(editForm.score)||0 });
    setEditModal(null);
  };
 
  const handleDelete = (u) => {
    if (u.role === 'admin') { Alert.alert('Gadagan', 'Admin pozmak bolmaz!'); return; }
    Alert.alert('Pozmak', `"${u.username}" pozmak isleýärsiňizmi?`, [
      { text:'Ýok', style:'cancel' },
      { text:'Poz', style:'destructive', onPress: () => deleteUser(u.id) },
    ]);
  };
 
  const totalScore = users.reduce((s,u) => s+(u.score||0), 0);
 
  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <LinearGradient colors={[C.primary,'#0f1d35']} style={styles.header}>
        <Text style={styles.adminTitle}>👑 Admin Panel</Text>
        <View style={styles.adminStats}>
          <View style={styles.adminStat}>
            <Text style={styles.adminStatNum}>{users.length}</Text>
            <Text style={styles.adminStatLbl}>Ulanyjy</Text>
          </View>
          <View style={[styles.adminStat, { borderLeftWidth:1, borderRightWidth:1, borderColor:'rgba(255,255,255,.2)' }]}>
            <Text style={styles.adminStatNum}>{users.filter(u=>u.role!=='admin').length}</Text>
            <Text style={styles.adminStatLbl}>Okuwçy</Text>
          </View>
          <View style={styles.adminStat}>
            <Text style={styles.adminStatNum}>{totalScore}</Text>
            <Text style={styles.adminStatLbl}>Jemi bal</Text>
          </View>
        </View>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color={C.light} style={{ marginRight:8 }} />
          <TextInput style={styles.searchInput} placeholder="Gözleg..." placeholderTextColor={C.light} value={search} onChangeText={setSearch} />
        </View>
      </LinearGradient>
 
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {filtered.map(u => (
          <View key={u.id} style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarTxt}>{(u.name||u.username)[0].toUpperCase()}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userCardName}>{u.name||'—'} {u.surname||''}</Text>
              <Text style={styles.userCardHandle}>@{u.username}</Text>
              <View style={styles.userCardRow}>
                <Text style={styles.userScore}>⭐ {u.score||0}</Text>
                {u.role==='admin' && <View style={styles.adminTag}><Text style={styles.adminTagTxt}>ADMIN</Text></View>}
              </View>
            </View>
            <View style={styles.userActions}>
              <TouchableOpacity style={styles.editUserBtn} onPress={() => openEdit(u)}>
                <Ionicons name="create-outline" size={18} color={C.accent} />
              </TouchableOpacity>
              {u.role !== 'admin' && (
                <TouchableOpacity style={styles.delUserBtn} onPress={() => handleDelete(u)}>
                  <Ionicons name="trash-outline" size={18} color={C.err} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
        <View style={{ height:30 }} />
      </ScrollView>
 
      <Modal visible={!!editModal} transparent animationType="slide" onRequestClose={() => setEditModal(null)}>
        <Pressable style={styles.overlay} onPress={() => setEditModal(null)} />
        {editModal && (
          <View style={styles.editModalBox}>
            <Text style={styles.editModalTitle}>✏️ {editModal.username} - Üýtget</Text>
            {[
              { key:'name', label:'Ady', icon:'person-outline' },
              { key:'email', label:'Email', icon:'mail-outline' },
              { key:'score', label:'Bal', icon:'star-outline', keyboard:'numeric' },
            ].map(f => (
              <View key={f.key} style={styles.inputWrap}>
                <Ionicons name={f.icon} size={16} color={C.accent} style={{ marginRight:8 }} />
                <TextInput
                  style={styles.input}
                  placeholder={f.label}
                  placeholderTextColor={C.light}
                  value={editForm[f.key]}
                  onChangeText={v => setEditForm(p=>({...p,[f.key]:v}))}
                  keyboardType={f.keyboard||'default'}
                />
              </View>
            ))}
            <View style={styles.editModalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModal(null)}>
                <Text style={styles.cancelBtnTxt}>Ýap</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveModalBtn} onPress={saveEdit}>
                <Text style={styles.saveModalBtnTxt}>✅ Sakla</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}
 
const styles = StyleSheet.create({
  flex: { flex:1, backgroundColor:C.bg },
  header: { paddingTop:50, paddingHorizontal:20, paddingBottom:20, alignItems:'center' },
  avatar: { width:72, height:72, borderRadius:36, backgroundColor:'rgba(255,255,255,.15)', alignItems:'center', justifyContent:'center', marginBottom:10, borderWidth:2.5, borderColor:C.gold },
  avatarTxt: { fontSize:30, fontWeight:'900', color:'#fff' },
  userName: { fontSize:20, fontWeight:'900', color:'#fff' },
  userHandle: { color:'rgba(255,255,255,.5)', fontSize:13, marginTop:2, marginBottom:8 },
  levelBadge: { borderRadius:20, paddingHorizontal:14, paddingVertical:5 },
  levelBadgeTxt: { color:'#fff', fontWeight:'800', fontSize:12 },
  body: { flex:1 },
  statsRow: { flexDirection:'row', padding:16, gap:10 },
  statCard: { flex:1, backgroundColor:C.card, borderRadius:12, padding:12, alignItems:'center', borderTopWidth:3, elevation:2, shadowColor:'#000', shadowOpacity:.07, shadowRadius:6 },
  statNum: { fontSize:22, fontWeight:'900', marginBottom:2 },
  statLbl: { fontSize:10, color:C.light, textAlign:'center' },
  section: { backgroundColor:C.card, borderRadius:16, margin:16, marginTop:0, padding:18, elevation:2, shadowColor:'#000', shadowOpacity:.07, shadowRadius:8, shadowOffset:{width:0,height:3} },
  sectionHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14 },
  sectionTitle: { fontSize:15, fontWeight:'800', color:C.text },
  editLink: { color:C.accent, fontWeight:'700', fontSize:13 },
  langRow: { gap:8 },
  langBtn: { borderRadius:12, paddingVertical:10, paddingHorizontal:14, borderWidth:1.5, borderColor:'#e0e8ff', backgroundColor:'#f8faff' },
  langBtnActive: { backgroundColor:C.accent, borderColor:C.accent },
  langBtnTxt: { fontWeight:'700', fontSize:13, color:C.text },
  langBtnTxtActive: { color:'#fff' },
  infoCards: { gap:10 },
  infoRow: { flexDirection:'row', alignItems:'center', gap:14, backgroundColor:'#f8faff', borderRadius:12, padding:12 },
  infoIcon: { fontSize:22 },
  infoLabel: { fontSize:11, color:C.light, marginBottom:2 },
  infoVal: { fontSize:14, fontWeight:'700', color:C.text },
  editForm: { gap:10 },
  inputWrap: { flexDirection:'row', alignItems:'center', backgroundColor:'#f5f7ff', borderRadius:12, paddingHorizontal:14, borderWidth:1, borderColor:'#e0e8ff' },
  input: { flex:1, paddingVertical:12, fontSize:14, color:C.text },
  saveBtn: { borderRadius:12, overflow:'hidden', marginTop:4 },
  saveBtnGrad: { paddingVertical:13, alignItems:'center' },
  saveBtnTxt: { color:'#fff', fontWeight:'800', fontSize:14 },
  logoutBtn: { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, margin:16, marginTop:0, backgroundColor:'#fde8e8', borderRadius:14, paddingVertical:14, borderWidth:1.5, borderColor:'#fbd0d0' },
  logoutTxt: { color:C.err, fontWeight:'800', fontSize:14 },
  adminTitle: { color:'#fff', fontSize:22, fontWeight:'900', marginBottom:14 },
  adminStats: { flexDirection:'row', backgroundColor:'rgba(255,255,255,.1)', borderRadius:14, padding:14, width:'100%', marginBottom:14 },
  adminStat: { flex:1, alignItems:'center' },
  adminStatNum: { color:'#fff', fontSize:22, fontWeight:'900' },
  adminStatLbl: { color:'rgba(255,255,255,.5)', fontSize:11, marginTop:2 },
  searchWrap: { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,.1)', borderRadius:12, paddingHorizontal:14, paddingVertical:10, width:'100%' },
  searchInput: { flex:1, color:'#fff', fontSize:14 },
  userCard: { flexDirection:'row', alignItems:'center', backgroundColor:C.card, borderRadius:14, marginHorizontal:16, marginBottom:8, padding:14, elevation:2, shadowColor:'#000', shadowOpacity:.06, shadowRadius:6, shadowOffset:{width:0,height:2} },
  userAvatar: { width:44, height:44, borderRadius:22, backgroundColor:C.accent, alignItems:'center', justifyContent:'center', marginRight:12 },
  userAvatarTxt: { color:'#fff', fontSize:18, fontWeight:'900' },
  userInfo: { flex:1 },
  userCardName: { fontSize:14, fontWeight:'800', color:C.text },
  userCardHandle: { fontSize:12, color:C.light },
  userCardRow: { flexDirection:'row', alignItems:'center', gap:8, marginTop:2 },
  userScore: { fontSize:12, color:C.gold, fontWeight:'700' },
  adminTag: { backgroundColor:'#fef9e7', borderRadius:10, paddingHorizontal:8, paddingVertical:2 },
  adminTagTxt: { color:'#b7791f', fontSize:10, fontWeight:'800' },
  userActions: { gap:8 },
  editUserBtn: { width:34, height:34, borderRadius:17, backgroundColor:'#e8f0ff', alignItems:'center', justifyContent:'center' },
  delUserBtn: { width:34, height:34, borderRadius:17, backgroundColor:'#fde8e8', alignItems:'center', justifyContent:'center' },
  overlay: { flex:1, backgroundColor:'rgba(0,0,0,.5)' },
  editModalBox: { backgroundColor:C.card, borderTopLeftRadius:24, borderTopRightRadius:24, padding:24 },
  editModalTitle: { fontSize:16, fontWeight:'800', color:C.text, marginBottom:16, textAlign:'center' },
  editModalBtns: { flexDirection:'row', gap:10, marginTop:16 },
  cancelBtn: { flex:1, borderRadius:12, paddingVertical:12, alignItems:'center', backgroundColor:'#f0f4ff', borderWidth:1, borderColor:'#e0e8ff' },
  cancelBtnTxt: { color:C.light, fontWeight:'700', fontSize:14 },
  saveModalBtn: { flex:1, borderRadius:12, paddingVertical:12, alignItems:'center', backgroundColor:'#27ae60' },
  saveModalBtnTxt: { color:'#fff', fontWeight:'800', fontSize:14 },
});