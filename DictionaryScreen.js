import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../navigation/AuthContext';
import { useLang } from '../navigation/LangContext';
import { WORDS, CATEGORIES } from '../data/words';

const C = { primary:'#1B2A4A', accent:'#4A90D9', gold:'#F5C518', bg:'#F0F4FF', card:'#fff', text:'#1a1a2e', light:'#8892b0' };
const LEVEL_COLOR = { beginner:'#27ae60', intermediate:'#e67e22', advanced:'#e74c3c' };

export default function DictionaryScreen() {
  const { user, toggleFavorite } = useAuth();
  const { t, lang } = useLang();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');
  const [level, setLevel] = useState('all');
  const [onlyFav, setOnlyFav] = useState(false);
  const [selected, setSelected] = useState(null);
  const [catModal, setCatModal] = useState(false);

  const favIds = user?.favorites || [];

  const filtered = useMemo(() => {
    let res = WORDS;
    if (cat !== 'all') res = res.filter(w => w.category === cat);
    if (level !== 'all') res = res.filter(w => w.level === level);
    if (onlyFav) res = res.filter(w => favIds.includes(w.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(w => w.en.toLowerCase().includes(q) || w.tk.toLowerCase().includes(q) || w.ru.toLowerCase().includes(q));
    }
    return res;
  }, [search, cat, level, onlyFav, favIds]);

  const isFav = (id) => favIds.includes(id);

  const renderWord = ({ item }) => (
    <TouchableOpacity style={styles.wordCard} onPress={() => setSelected(item)} activeOpacity={0.8}>
      <View style={styles.wordLeft}>
        <Text style={styles.wordEn}>{item.en}</Text>
        <Text style={styles.wordTk}>🇹🇲 {item.tk}</Text>
        <Text style={styles.wordRu}>🇷🇺 {item.ru}</Text>
      </View>
      <View style={styles.wordRight}>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.favBtn}>
          <Ionicons name={isFav(item.id) ? 'heart' : 'heart-outline'} size={20} color={isFav(item.id) ? '#e74c3c' : C.light} />
        </TouchableOpacity>
        <View style={[styles.levelBadge, { backgroundColor: LEVEL_COLOR[item.level] }]}>
          <Text style={styles.levelText}>{item.level[0].toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const selectedCat = CATEGORIES.find(c => c.id === cat) || CATEGORIES[0];

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* Header */}
      <LinearGradient colors={[C.primary, '#0f1d35']} style={styles.header}>
        <Text style={styles.headerTitle}>📖 {t.dictionary}</Text>
        <Text style={styles.headerCount}>{filtered.length} / {WORDS.length} söz</Text>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color={C.light} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.search}
            placeholderTextColor={C.light}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={C.light} />
            </TouchableOpacity>
          ) : null}
        </View>
      </LinearGradient>

      {/* Filter bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.catPicker} onPress={() => setCatModal(true)}>
          <Text style={styles.catPickerText}>{selectedCat.icon} {selectedCat[lang] || selectedCat.en}</Text>
          <Ionicons name="chevron-down" size={14} color={C.accent} />
        </TouchableOpacity>

        <View style={styles.filterRight}>
          {['all','beginner','intermediate','advanced'].map(l => (
            <TouchableOpacity key={l} onPress={() => setLevel(l)} style={[styles.filterBtn, level===l && styles.filterBtnActive]}>
              <Text style={[styles.filterBtnTxt, level===l && styles.filterBtnTxtActive]}>
                {l==='all'?'All':l[0].toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setOnlyFav(!onlyFav)} style={[styles.filterBtn, onlyFav && { backgroundColor:'#fde8e8', borderColor:'#e74c3c' }]}>
            <Ionicons name={onlyFav ? 'heart' : 'heart-outline'} size={14} color={onlyFav ? '#e74c3c' : C.light} />
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={renderWord}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>Söz tapylmady 🔍</Text>}
      />

      {/* Word detail modal */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.overlay} onPress={() => setSelected(null)} />
        {selected && (
          <View style={styles.detailModal}>
            <LinearGradient colors={[C.primary, '#1a2a5e']} style={styles.detailHeader}>
              <Text style={styles.detailEn}>{selected.en}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(selected.id)} style={styles.detailFav}>
                <Ionicons name={isFav(selected.id) ? 'heart' : 'heart-outline'} size={24} color={isFav(selected.id) ? '#e74c3c' : '#fff'} />
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.detailBody}>
              <View style={styles.detailRow}>
                <Text style={styles.detailFlag}>🇹🇲</Text>
                <View>
                  <Text style={styles.detailLabel}>Türkmençe</Text>
                  <Text style={styles.detailVal}>{selected.tk}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailFlag}>🇷🇺</Text>
                <View>
                  <Text style={styles.detailLabel}>Русский</Text>
                  <Text style={styles.detailVal}>{selected.ru}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailFlag}>🇬🇧</Text>
                <View>
                  <Text style={styles.detailLabel}>English</Text>
                  <Text style={styles.detailVal}>{selected.en}</Text>
                </View>
              </View>
              <View style={styles.detailMeta}>
                <View style={[styles.metaBadge, { backgroundColor: LEVEL_COLOR[selected.level] }]}>
                  <Text style={styles.metaBadgeTxt}>{selected.level}</Text>
                </View>
                <View style={styles.metaBadge2}>
                  <Text style={styles.metaBadgeTxt2}>#{selected.category}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
                <Text style={styles.closeBtnTxt}>Ýap</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>

      {/* Category modal */}
      <Modal visible={catModal} transparent animationType="slide" onRequestClose={() => setCatModal(false)}>
        <Pressable style={styles.overlay} onPress={() => setCatModal(false)} />
        <View style={styles.catModal}>
          <Text style={styles.catModalTitle}>Kategoriýa saýla</Text>
          <FlatList
            data={CATEGORIES}
            keyExtractor={i => i.id}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.catItem, cat===item.id && styles.catItemActive]}
                onPress={() => { setCat(item.id); setCatModal(false); }}
              >
                <Text style={styles.catItemIcon}>{item.icon}</Text>
                <Text style={[styles.catItemTxt, cat===item.id && { color: C.accent }]} numberOfLines={2}>
                  {item[lang] || item.en}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex:1, backgroundColor: C.bg },
  header: { paddingTop:50, paddingHorizontal:16, paddingBottom:16 },
  headerTitle: { color:'#fff', fontSize:20, fontWeight:'800', marginBottom:2 },
  headerCount: { color:'rgba(255,255,255,.5)', fontSize:12, marginBottom:12 },
  searchWrap: { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,.1)', borderRadius:12, paddingHorizontal:14, paddingVertical:10 },
  searchInput: { flex:1, color:'#fff', fontSize:14 },
  filterBar: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:12, paddingVertical:10, backgroundColor:C.card, borderBottomWidth:1, borderBottomColor:'#e8eeff' },
  catPicker: { flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#f0f4ff', borderRadius:20, paddingHorizontal:12, paddingVertical:6, maxWidth:160 },
  catPickerText: { fontSize:12, color:C.text, fontWeight:'600', flexShrink:1 },
  filterRight: { flexDirection:'row', gap:4 },
  filterBtn: { width:30, height:30, borderRadius:15, backgroundColor:'#f0f4ff', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#e0e8ff' },
  filterBtnActive: { backgroundColor:C.accent, borderColor:C.accent },
  filterBtnTxt: { fontSize:10, fontWeight:'700', color:C.light },
  filterBtnTxtActive: { color:'#fff' },
  list: { padding:12, gap:8, paddingBottom:30 },
  wordCard: { backgroundColor:C.card, borderRadius:14, padding:14, flexDirection:'row', alignItems:'center', elevation:2, shadowColor:'#000', shadowOpacity:.06, shadowRadius:6, shadowOffset:{width:0,height:2} },
  wordLeft: { flex:1 },
  wordEn: { fontSize:17, fontWeight:'800', color:C.primary, marginBottom:4 },
  wordTk: { fontSize:13, color:C.accent, fontWeight:'600' },
  wordRu: { fontSize:13, color:'#8e44ad', fontWeight:'600', marginTop:2 },
  wordRight: { alignItems:'center', gap:8 },
  favBtn: { padding:4 },
  levelBadge: { width:22, height:22, borderRadius:11, alignItems:'center', justifyContent:'center' },
  levelText: { color:'#fff', fontSize:10, fontWeight:'900' },
  empty: { textAlign:'center', color:C.light, marginTop:60, fontSize:16 },
  overlay: { flex:1, backgroundColor:'rgba(0,0,0,.5)' },
  detailModal: { backgroundColor:C.card, borderTopLeftRadius:24, borderTopRightRadius:24, overflow:'hidden', maxHeight:'65%' },
  detailHeader: { padding:24, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  detailEn: { fontSize:28, fontWeight:'900', color:'#fff', flex:1 },
  detailFav: { padding:8 },
  detailBody: { padding:24 },
  detailRow: { flexDirection:'row', alignItems:'center', gap:16, marginBottom:16, backgroundColor:'#f8faff', borderRadius:12, padding:14 },
  detailFlag: { fontSize:28 },
  detailLabel: { fontSize:11, color:C.light, marginBottom:2 },
  detailVal: { fontSize:18, fontWeight:'800', color:C.text },
  detailMeta: { flexDirection:'row', gap:8, marginTop:4, marginBottom:16 },
  metaBadge: { paddingHorizontal:12, paddingVertical:4, borderRadius:20 },
  metaBadgeTxt: { color:'#fff', fontSize:11, fontWeight:'700' },
  metaBadge2: { paddingHorizontal:12, paddingVertical:4, borderRadius:20, backgroundColor:'#f0f4ff' },
  metaBadgeTxt2: { color:C.accent, fontSize:11, fontWeight:'700' },
  closeBtn: { backgroundColor:C.primary, borderRadius:12, paddingVertical:12, alignItems:'center' },
  closeBtnTxt: { color:'#fff', fontWeight:'700', fontSize:15 },
  catModal: { backgroundColor:C.card, borderTopLeftRadius:24, borderTopRightRadius:24, padding:20, maxHeight:'70%' },
  catModalTitle: { fontSize:17, fontWeight:'800', color:C.text, marginBottom:14, textAlign:'center' },
  catItem: { flex:1, margin:4, backgroundColor:'#f8faff', borderRadius:12, padding:12, alignItems:'center', borderWidth:1, borderColor:'#e0e8ff' },
  catItemActive: { borderColor:C.accent, backgroundColor:'#e8f0ff' },
  catItemIcon: { fontSize:22, marginBottom:4 },
  catItemTxt: { fontSize:11, color:C.text, fontWeight:'600', textAlign:'center' },
});
