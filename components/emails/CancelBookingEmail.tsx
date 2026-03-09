import { Body, Container, Head, Heading, Html, Preview, Section, Text, Tailwind, Hr, Img } from '@react-email/components';
import * as React from 'react';

interface CancelBookingEmailProps {
  customerName: string;
  businessName: string;
  date: string;
  time: string;
  logoUrl?: string
}

export const CancelBookingEmail = ({
  customerName = 'Cliente',
  businessName = 'nuestro local',
  date = 'Fecha',
  time = 'Hora',
  logoUrl
}: CancelBookingEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Aviso de cancelación: Tu cita en {businessName}</Preview>
      
      {/* Configuramos Tailwind con tu paleta exacta */}
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                bgBase: '#09090b',    // zinc-950
                bgCard: '#18181b',    // zinc-900
                borderSubtle: '#27272a', // zinc-800
                textMain: '#fafafa',  // zinc-50
                textMuted: '#a1a1aa', // zinc-400
                brand: '#eab308',     // yellow-500
                danger: '#ef4444',    // red-500
                dangerBg: '#450a0a',  // red-950
              },
            },
          },
        }}
      >
        <Body className="bg-bgBase my-auto mx-auto font-sans px-4 py-10">
          
          <Container className="bg-bgCard border border-solid border-borderSubtle rounded-2xl mx-auto max-w-[500px] overflow-hidden shadow-2xl">
            
            {/* Cabecera del negocio */}
            <Section className="bg-bgBase border-b border-solid border-borderSubtle py-6 px-8 text-center">
              <Img src={logoUrl} width="100" height="100" alt="Logo" className="mx-auto mb-4 rounded-xl border border-white/20" />
            </Section>

            <Section className="px-8 py-6">
              {/* Etiqueta de estado */}
              <Section className="text-center mb-4">
                <span className="bg-dangerBg border border-solid border-danger/30 text-danger text-[12px] font-bold px-3 py-1 rounded-full">
                  Reserva Anulada
                </span>
              </Section>

              <Heading className="text-textMain text-xl font-bold text-center m-0 mb-6">
                Hola {customerName},
              </Heading>
              
              <Text className="text-textMuted text-[15px] leading-[24px] text-center m-0 mb-6">
                Te escribimos para confirmarte que tu reserva ha sido <strong className="text-textMain">cancelada correctamente</strong>. 
                A continuación te recordamos los datos de la cita anulada:
              </Text>

              {/* Caja de detalles de la reserva */}

               <Section className="bg-bgBase rounded-lg p-6 my-[24px] text-center border border-solid border-[#e6ebf1]">
              <Text className="text-textMain text-[16px] m-0 font-bold capitalize">
                {date}
              </Text>
              <Text className="text-textMuted text-[15px] m-0 mt-2">
                Hora: <strong>{time}</strong>
              </Text>
            </Section>

              <Hr className="border border-solid border-borderSubtle my-8 mx-0 w-full" />

              <Text className="text-textMuted text-[14px] leading-[24px] text-center m-0 mb-4">
                Si ha sido un error o deseas programar una nueva cita, estaremos encantados de volver a verte por el local.
              </Text>
              
            </Section>

            {/* Footer */}
            <Section className="bg-bgBase py-4 px-8 text-center border-t border-solid border-borderSubtle">
              <Text className="text-[#71717a] text-[11px] leading-[20px] m-0">
                Este es un correo automático, por favor no respondas a esta dirección.<br />
                © {new Date().getFullYear()} {businessName}.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CancelBookingEmail;