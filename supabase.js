import {
  createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"


const supabaseUrl =
  "https://qexgbswdbwlpydolpcll.supabase.co"

const supabaseKey =
  "sb_publishable_3Vo6VOuDzVbN5355c9HeDA_1YwQPR6l"


export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        flowType:
          "pkce",

        persistSession:
          true,

        detectSessionInUrl:
          true
      }
    }
  )


export const authInicializada =
  new Promise(
    (resolve) => {

      const {
        data: {
          subscription
        }
      } =
        supabase.auth.onAuthStateChange(
          (
            event,
            session
          ) => {

            if (
              event ===
              "INITIAL_SESSION"
            ) {

              subscription.unsubscribe()

              resolve(
                session
              )

            }
          }
        )

    }
  )
