import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const memberId = () => `MBR-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const profileForm = document.getElementById('profileForm');

if (signupForm) signupForm.onsubmit = async (e) => { e.preventDefault(); const {email,password}=Object.fromEntries(new FormData(signupForm)); const cred=await createUserWithEmailAndPassword(auth,email,password); await setDoc(doc(db,'users',cred.user.uid),{uid:cred.user.uid,email,memberId:memberId(),role:'member',verificationStatus:'pending_verification',paid:false,banned:false,inviteCode:null,inviteUsed:false,manualOverride:false,createdAt:Date.now()}); location.href='verification.html'; };
if (loginForm) loginForm.onsubmit = async (e) => { e.preventDefault(); const {email,password}=Object.fromEntries(new FormData(loginForm)); await signInWithEmailAndPassword(auth,email,password); };

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  const snap = await getDoc(doc(db,'users',user.uid));
  if (!snap.exists()) return;
  const u=snap.data();
  if (location.pathname.endsWith('login.html')) {
    if (u.banned) return location.href='index.html';
    if (u.verificationStatus==='pending_verification'||u.verificationStatus==='pending_admin_review') return location.href='verification.html';
    if (u.verificationStatus==='approved_pending_invite'&&!u.manualOverride) return location.href='invite.html';
    if (!u.paid&&!u.manualOverride) return location.href='payment.html';
    return location.href='dashboard.html';
  }
  if (profileForm) profileForm.onsubmit = async (e)=>{e.preventDefault(); await updateDoc(doc(db,'users',user.uid),Object.fromEntries(new FormData(profileForm))); alert('Saved');};
});
if (logoutBtn) logoutBtn.onclick = async ()=>{await signOut(auth);location.href='index.html'};
