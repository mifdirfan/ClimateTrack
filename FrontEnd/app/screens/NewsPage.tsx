import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import NewsComponent from '@/components/NewsCard';

export default function NewsPage() {
  // Static content
  const imageSource = require('@/assets/images/warning.jpg');
  const headline = 'Warning of heavy rain, thunderstorm nationwide until 7pm';
  const content = `KUALA LUMPUR: The Malaysian Meteorological Department (MetMalaysia) has issued a warning of heavy rain, thunderstorms and strong winds in almost the whole country until 7 pm on Thursday (May 8).

MetMalaysia, in a statement, said there are indications of thunderstorms with rainfall intensity exceeding 20 mm/hour expected to occur for more than an hour.

The warning covered Kuala Lumpur and Putrajaya as well as Langkawi, Padang Terap, Pendang, Sik and Baling in Kedah; Hulu Perak, Kuala Kangsar, Kinta, Perak Tengah, Kampar, Manjung, Hilir Perak, and Larut, Matang and Selama in Perak; Tanjung Malim in Perak and Muallim, Perak; Selama and Hulu Perak in Perak; Gombak and Hulu Langat in Selangor; Bentong and Temerloh in Pahang; Kuantan, Pekan, Rompin and Maran in Pahang; and Cameron Highlands in Pahang.

The department also said there are chances of floods in the above areas and advised the public to take precautions.`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f3f4' }}>
      <StatusBar barStyle="dark-content" />
      <NewsComponent
        imageSource={imageSource}
        headline={headline}
        content={content}
      />
    </SafeAreaView>
  );
}
