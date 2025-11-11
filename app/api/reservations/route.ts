// app/api/reservations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, guests, message } = body;

    // Validasyon
    if (!name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: 'Alle Pflichtfelder müssen ausgefüllt werden' },
        { status: 400 }
      );
    }

    // Supabase client oluştur
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Rezervasyonu kaydet
    const { data, error } = await supabase
      .from('reservations')
      .insert([
        {
          name,
          email,
          phone,
          date,
          time,
          guests: parseInt(guests),
          message: message || null,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Fehler beim Speichern der Reservierung' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Reservierung erfolgreich eingereicht',
        data 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Kullanıcı kontrolü
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    // Rezervasyonları getir
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Fehler beim Laden der Reservierungen' },
        { status: 500 }
      );
    }

    return NextResponse.json({ reservations: data }, { status: 200 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
