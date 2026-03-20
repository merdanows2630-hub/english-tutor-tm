import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../navigation/AuthContext';
import { useLang } from '../navigation/LangContext';
import { REBUSES } from '../data/rebuses';

const C = { primary:'#1B2A4A', accent:'#4A90D9', gold:'#F5C518', bg:'#F0F4FF', card:'#fff', text:'#1a1a2e', light:'#8892b0', ok:'#27ae60', err:'#e74c3c' };

function shuffle(arr) {
  const a = [...arr];
  for (let i=a.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

// Scramble screen
function UnscrambleGame({ item, onCorrect, onWrong }) {
  const letters = shuffle(item.answer.split(''));
  const [chosen, setChosen] = useState([]);
  const [remaining, setRemaining] = useState(letters.map((l,i) => ({ l, i, used:false })));
  const [result, setResult] = useState(null); // null | 'ok' | 'err'

  const pick = (idx) => {
    if (result) return;
    const letter = remaining[idx].l;
    setChosen(c => [...c, { l:letter, srcIdx:idx }]);
    setRemaining(r => r.map((item,i) => i===idx ? {...item, used:true} : item));
    const newChosen = [...chosen, { l:letter }];
    if (newChosen.length === item.answer.length) {
      const word = newChosen.map(c=>c.l).join('');
      if (word === item.answer) { setResult('ok'); setTimeout(onCorrect, 800); }
      else { setResult('err'); setTimeout(onWrong, 800); }
    }
  };

  const unpick = (idx) => {
    if (result) return;
    const { srcIdx } = chosen[idx];
    setChosen(c => c.filter((_,i)=>i!==idx));
    setRemaining(r => r.map((item,i) => i===srcIdx ? {...item, used:false} : item));
    setResult(null);
  };

  return (
    <View style={styles.gameBox}>
      <Text style={styles.hintTxt}>{item.hint}</Text>
      <View style={styles.tkRuRow}>
        <Text style={styles.tkWord}>🇹🇲 {item.tk}</Text>
        <Text style={styles.ruWord}>🇷🇺 {item.ru}</Text>
      </View>

      {/* Answer slots */}
      <View style={styles.slots}>
        {Array.from({ length: item.answer.length }).map((_, i) => (
          <TouchableOpacity key={i} style={[styles.slot, result==='ok' && styles.slotOk, result==='err' && styles.slotErr]}
            onPress={() => chosen[i] && unpick(i)}>
            <Text style={styles.slotTxt}>{chosen[i]?.l || ''}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {result && (
        <Text style={[styles.resultTxt, { color: result==='ok' ? C.ok : C.err }]}>
          {result==='ok' ? '✅ Dogry!' : `❌ Nädogry! Dogrysy: ${item.answer}`}
        </Text>
      )}

      {/* Letter buttons */}
      <View style={styles.letterPool}>
        {remaining.map((it, i) => (
          <TouchableOpacity key={i} style={[styles.letterBtn, it.used && styles.letterUsed]}
            onPress={() => !it.used && pick(i)} disabled={it.used}>
            <Text style={[styles.letterTxt, it.used && styles.letterTxtUsed]}>{it.l}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Fill screen
function FillGame({ item, onCorrect, onWrong }) {
  const [selected, setSelected] = useState(null);

  const pick = (opt) => {
    if (selected) return;
    setSelected(opt);
    if (opt === item.answer) setTimeout(onCorrect, 700);
    else setTimeout(onWrong, 700);
  };

  return (
    <View style={styles.gameBox}>
      <Text style={styles.fillQ}>{item.question}</Text>
      <Text style={styles.hintTxt}>{item.hint}</Text>
      <View style={styles.fillOpts}>
        {item.options.map((opt, i) => {
          let bg = C.card, border = '#e0e8ff', txtColor = C.text;
          if (selected) {
            if (opt === item.answer) { bg='#e8f8f0'; border=C.ok; txtColor=C.ok; }
            else if (opt === selected) { bg='#fde8e8'; border=C.err; txtColor=C.err; }
            else { bg='#f8faff'; border='#e0e8ff'; txtColor=C.light; }
          }
          return (
            <TouchableOpacity key={i} style={[styles.fillOpt, { backgroundColor:bg, borderColor:border }]} onPress={() => pick(opt)}>
              <Text style={[styles.fillOptTxt, { color:txtColor }]}>{opt}</Text>
              {selected && opt===item.answer && <Ionicons name="checkmark-circle" size={18} color={C.ok} />}
              {selected && opt===selected && opt!==item.answer && <Ionicons name="close-circle" size={18} color={C.err} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function RebusPlayScreen({ route, navigation }) {
  const { level, type } = route.params;
  const { addScore } = useAuth();
  const { t } = useLang();

  const questions = useCallback(() => {
    let pool = REBUSES;
    if (level !== 'all') pool = pool.filter(r => r.level===level);
    if (type !== 'all') pool = pool.filter(r => r.type===type);
    return shuffle(pool).slice(0, Math.min(15, pool.length));
  }, [level, type])();

  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);
  const [key, setKey] = useState(0);

  const q = questions[idx];
  const total = questions.length;

  const advance = async (isOk) => {
    if (isOk) setCorrect(c => c+1); else setWrong(w => w+1);
    if (idx+1 >= total) {
      await addScore(isOk ? (correct+1)*8 : correct*8);
      setDone(true);
    } else {
      setIdx(i => i+1);
      setKey(k => k+1);
    }
  };

  const pct = Math.round((correct/total)*100);

  if (done) {
    return (
      <LinearGradient colors={[C.primary,'#0f1d35']} style={styles.flex}>
        <StatusBar barStyle="light-content" />
        <View style={styles.resultBox}>
          <Text style={styles.resultEmoji}>{pct>=80?'🏆':pct>=50?'⭐':'📚'}</Text>
          <Text style={styles.resultTitle}>{t.result}</Text>
          <Text style={styles.resultPct}>{pct}%</Text>
          <View style={styles.resultStats}>
            <View style={styles.rStat}>
              <Text style={[styles.rStatNum, { color:C.ok }]}>{correct}</Text>
              <Text style={styles.rStatLbl}>✅ Dogry</Text>
            </View>
            <View style={[styles.rStat, { borderLeftWidth:1, borderRightWidth:1, borderColor:'rgba(255,255,255,.15)' }]}>
              <Text style={[styles.rStatNum, { color:C.gold }]}>{total}</Text>
              <Text style={styles.rStatLbl}>Jemi</Text>
            </View>
            <View style={styles.rStat}>
              <Text style={[styles.rStatNum, { color:C.err }]}>{wrong}</Text>
              <Text style={styles.rStatLbl}>❌ Nädogry</Text>
            </View>
          </View>
          <Text style={styles.earnedPts}>+{correct*8} bal ⭐</Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.doneBtnTxt}>← Yza dön</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[C.primary,'#0f1d35']} style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.topCenter}>
          <Text style={styles.topCount}>{idx+1} / {total}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width:`${(idx/total)*100}%` }]} />
          </View>
        </View>
        <Text style={styles.scoreText}>✅{correct} ❌{wrong}</Text>
      </LinearGradient>

      <View style={styles.typeTag}>
        <Text style={styles.typeTagTxt}>{q.type==='unscramble' ? '🔀 Harp düz' : '✏️ Boş doldur'}</Text>
      </View>

      {q.type === 'unscramble' ? (
        <UnscrambleGame key={key} item={q} onCorrect={() => advance(true)} onWrong={() => advance(false)} />
      ) : (
        <FillGame key={key} item={q} onCorrect={() => advance(true)} onWrong={() => advance(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex:1, backgroundColor:C.bg },
  topBar: { paddingTop:50, paddingHorizontal:16, paddingBottom:14, flexDirection:'row', alignItems:'center', gap:12 },
  backBtn: { padding:6 },
  topCenter: { flex:1 },
  topCount: { color:'rgba(255,255,255,.7)', fontSize:12, marginBottom:4, textAlign:'center' },
  progressBar: { height:6, backgroundColor:'rgba(255,255,255,.15)', borderRadius:3, overflow:'hidden' },
  progressFill: { height:'100%', backgroundColor:C.gold, borderRadius:3 },
  scoreText: { color:'#fff', fontSize:11, fontWeight:'700' },
  typeTag: { alignSelf:'center', marginTop:12, backgroundColor:'#e8f0ff', borderRadius:20, paddingHorizontal:14, paddingVertical:5 },
  typeTagTxt: { color:C.accent, fontWeight:'700', fontSize:12 },
  gameBox: { flex:1, padding:20 },
  hintTxt: { fontSize:28, textAlign:'center', marginBottom:8 },
  tkRuRow: { flexDirection:'row', justifyContent:'center', gap:20, marginBottom:20 },
  tkWord: { fontSize:14, color:C.accent, fontWeight:'700' },
  ruWord: { fontSize:14, color:'#8e44ad', fontWeight:'700' },
  slots: { flexDirection:'row', flexWrap:'wrap', justifyContent:'center', gap:6, marginBottom:12 },
  slot: { width:38, height:44, borderRadius:8, backgroundColor:C.card, borderWidth:2, borderColor:'#e0e8ff', alignItems:'center', justifyContent:'center', elevation:2, shadowColor:'#000', shadowOpacity:.06, shadowRadius:4 },
  slotOk: { borderColor:C.ok, backgroundColor:'#e8f8f0' },
  slotErr: { borderColor:C.err, backgroundColor:'#fde8e8' },
  slotTxt: { fontSize:18, fontWeight:'900', color:C.text },
  resultTxt: { textAlign:'center', fontSize:15, fontWeight:'800', marginBottom:12 },
  letterPool: { flexDirection:'row', flexWrap:'wrap', justifyContent:'center', gap:8, marginTop:16 },
  letterBtn: { width:44, height:48, borderRadius:10, backgroundColor:C.accent, alignItems:'center', justifyContent:'center', elevation:3, shadowColor:C.accent, shadowOpacity:.3, shadowRadius:6, shadowOffset:{width:0,height:3} },
  letterUsed: { backgroundColor:'#e0e8ff', elevation:0 },
  letterTxt: { fontSize:20, fontWeight:'900', color:'#fff' },
  letterTxtUsed: { color:'#b0c0e0' },
  fillQ: { fontSize:20, fontWeight:'800', color:C.text, textAlign:'center', marginBottom:8, lineHeight:28 },
  fillOpts: { gap:10, marginTop:12 },
  fillOpt: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:C.card, borderRadius:14, paddingVertical:14, paddingHorizontal:18, borderWidth:1.5, borderColor:'#e0e8ff', elevation:2 },
  fillOptTxt: { fontSize:16, fontWeight:'700', flex:1 },
  // Result
  resultBox: { flex:1, alignItems:'center', justifyContent:'center', padding:32 },
  resultEmoji: { fontSize:72, marginBottom:16 },
  resultTitle: { color:'rgba(255,255,255,.6)', fontSize:16, marginBottom:8 },
  resultPct: { color:'#fff', fontSize:52, fontWeight:'900', marginBottom:24 },
  resultStats: { flexDirection:'row', backgroundColor:'rgba(255,255,255,.1)', borderRadius:16, padding:20, width:'100%', marginBottom:20 },
  rStat: { flex:1, alignItems:'center' },
  rStatNum: { fontSize:28, fontWeight:'900', marginBottom:4 },
  rStatLbl: { color:'rgba(255,255,255,.5)', fontSize:12 },
  earnedPts: { color:C.gold, fontSize:18, fontWeight:'800', marginBottom:28 },
  doneBtn: { backgroundColor:'rgba(255,255,255,.15)', borderRadius:14, paddingVertical:14, paddingHorizontal:40 },
  doneBtnTxt: { color:'#fff', fontWeight:'800', fontSize:15 },
});
