
import { NavItem, CompanyData } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: '会社概要', href: 'about' },
  { label: '事業内容', href: 'services' },
  { label: '実績紹介', href: 'portfolio' },
  { label: '採用情報', href: 'careers' },
  { label: 'お問い合わせ', href: 'contact' },
];

export const INITIAL_DATA: CompanyData = {
  "companyName": "NEXUS GLOBAL",
  "logoUrl": "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=200&h=200&fit=crop",
  "hero": {
    "title": "イノベーションの、その先へ。",
    "subTitle": "GLOBAL STANDARDS",
    "description": "最先端の技術と、洗練された叡智で、持続可能な未来をデザインする。地球規模の課題を解決し、新しい価値を創造します。",
    "bgImage": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069",
    "btnText": "私たちのビジョンを見る"
  },
  "news": [
    { "id": "1", "date": "2024.11.15", "category": "お知らせ", "title": "次世代AIプラットフォームのグローバル展開を開始いたしました。" },
    { "id": "2", "date": "2024.11.05", "category": "CSR", "title": "2030年までのカーボンニュートラル達成に向けたロードマップを策定。" },
    { "id": "3", "date": "2024.10.20", "category": "重要", "title": "新代表取締役就任に関するお知らせ" }
  ],
  "newsLabels": {
    "title": "更新情報",
    "sub": "LATEST UPDATES"
  },
  "services": [
    {
      "id": "s1",
      "title": "テクノロジーソリューション",
      "description": "最先端のAIプラットフォームを中心に、企業のDXを包括的に支援します。",
      "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      "fullContent": "基幹システムのクラウド化から、エッジコンピューティングによるリアルタイムデータ解析まで。洗練されたインフラがビジネスを支えます。"
    },
    {
      "id": "s2",
      "title": "再生可能エネルギー",
      "description": "持続可能な社会の実現に向け、次世代太陽光発電インフラの開発を推進します。",
      "image": "https://images.unsplash.com/photo-1466611653911-95282fc3656b?w=800",
      "fullContent": "ペロブスカイト太陽電池の商用化や、大規模蓄電池システムの構築を通じて、エネルギーの未来を切り拓きます。"
    }
  ],
  "serviceLabels": {
    "title": "グローバル市場における卓越性の追求",
    "sub": "OUR EXPERTISE",
    "allBtn": "全事業を見る",
    "detailBtn": "実績紹介を見る"
  },
  "portfolio": [
    {
      "id": "p1",
      "title": "次世代スマートシティ開発プロジェクト",
      "category": "都市開発",
      "client": "政府・自治体連合",
      "image": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
      "description": "AIとIoTを統合した、エネルギー効率を極限まで高めた次世代型都市インフラの設計・開発。"
    },
    {
      "id": "p2",
      "title": "グローバル金融プラットフォーム構築",
      "category": "金融テクノロジー",
      "client": "国際メガバンク",
      "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "description": "ブロックチェーン技術を用いたセキュアかつ低コストな国際決済システムの構築と運用支援。"
    }
  ],
  "portfolioLabels": {
    "title": "実績紹介",
    "sub": "CASE STUDIES & PORTFOLIO"
  },
  "careers": {
    "title": "未来を、共に創る。",
    "description": "個人の自律性と多様なバックグラウンドを尊重し、最先端のテクノロジーを駆使して「不可能な未来」に挑みます。",
    "sectionTitle": "募集職種",
    "sectionSub": "JOIN THE MISSION",
    "applyBtn": "この職種に応募する",
    "jobs": [
      { "id": "j1", "title": "AIエンジニア / データサイエンティスト", "dept": "技術本部", "location": "東京本社 / リモート可", "salary": "年俸 800万円 〜 1,500万円" },
      { "id": "j2", "title": "グローバル事業開発担当", "dept": "海外事業部", "location": "東京本社 / シンガポール", "salary": "年俸 700万円 〜 1,200万円" }
    ]
  },
  "about": {
    "title": "会社概要",
    "description": "私たちは、革新的な精神と確かな信頼を基盤に、グローバル社会の発展に貢献し続けます。",
    "sectionTitle": "企業プロフィール",
    "items": [
      { "id": "p1", "label": "社名", "value": "株式会社 NEXUS GLOBAL" },
      { "id": "p2", "label": "代表取締役", "value": "橋本 則之" },
      { "id": "p3", "label": "設立", "value": "2005年 4月" },
      { "id": "p4", "label": "資本金", "value": "120億 5,000万円" },
      { "id": "p5", "label": "所在地", "value": "東京都千代田区大手町 1-2-3 Nexus Tower" }
    ]
  },
  "contact": {
    "title": "お問い合わせ",
    "sub": "GET IN TOUCH",
    "desc": "至高のサービスと、革新的なソリューション。弊社の専門チームが、あなたのビジョンの実現をサポートいたします。下記連絡先、または公式SNSよりお気軽にお問い合わせください。",
    "email": "info@nexus-global.example.jp",
    "phone": "03-1234-5678",
    "address": "東京都千代田区大手町 1-2-3 Nexus Tower",
    "lineQr": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://line.me/",
    "instagramQr": "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://instagram.com/",
    "lineLabel": "公式LINEアカウント",
    "instagramLabel": "公式Instagram",
    "emailLabel": "メールアドレス",
    "phoneLabel": "代表電話",
    "addressLabel": "本社所在地"
  },
  "styles": {}
};
