#!/bin/bash
#: ------------------------------------------
clear && cd "${0%/*}" >/dev/null 2>&1
tput bel
#: ------------------------------------------

# Funkcja wykonująca główne zadanie (np. uruchomienie serwera HTTP)
execute_task() {
    echo
    # echo "Uruchamiam serwer HTTP w katalogu roboczym"
    # echo "Uruchamiam serwer HTTP w katalogu: $(pwd)"
    # echo -e "Uruchamiam serwer HTTP w katalogu:\n> $(pwd)"

    # Przykładowe polecenie - zastąp je swoim serwerem HTTP
    # python3 -m http.server 8000
    # Lub dla PHP: php -S localhost:8000
    # Lub dla Node.js: node server.js

    # ssh -p 22222 i3@i3.home.pl
    # scp -P 22222 ./package.json i3@i3.home.pl:/home/i3/public_html/
    # scp -P 22222 -r ./ai/* i3@i3.home.pl:/home/i3/public_html/___sauerland_new/ai/
    #: only hidden
    #: scp -P 22222 -rp ./dist/.[!.]* i3@i3.home.pl:/home/i3/public_html/___sauerland_new/
    #: scp -P 22222 ./dist/.[!.]* i3@i3.home.pl:/home/i3/public_html/___sauerland_new/

    npm run build

    echo

    #: delete
    ssh -p 22222 i3@i3.home.pl "rm -rf /home/i3/public_html/___sauerland_new/*"
    ssh -p 22222 i3@i3.home.pl "rm -rf /home/i3/public_html/___sauerland_new/.[!.]*"

    echo

    #: no hidden
    scp -P 22222 -rp ./dist/[!__]* i3@i3.home.pl:/home/i3/public_html/___sauerland_new/
    scp -P 22222 -p ./dist/.ht* i3@i3.home.pl:/home/i3/public_html/___sauerland_new/

    echo
}

# Główna pętla skryptu
main_loop() {
    while true; do
        #: ----------------------------------
        tput bel

        # Cicha zmiana ścieżki na bieżący katalog
        # cd "$(dirname "$0")" >/dev/null 2>&1

        # Uruchom zadanie w osobnej podpowłoce
        ( execute_task ) &
        task_pid=$!

        # Przechwyć Ctrl+C tylko dla głównego procesu
        trap 'kill -INT $task_pid 2>/dev/null' INT

        # Poczekaj na zakończenie zadania
        wait $task_pid
        task_exit_code=$?

        # Wyczyść trap
        trap - INT

        # Jeśli zadanie zostało przerwane (Ctrl+C)
        if [ $task_exit_code -eq 130 ]; then
            echo -e "\nSerwer został zatrzymany przez Ctrl+C"
            printf "Czy chcesz uruchomić serwer ponownie? (y/n): "
            while true; do
                read -n 1 -s choice
                case $choice in
                    [YyPp]*) echo ""; break;;
                    [NnQq]*) echo ""; echo "Zamykanie skryptu..."; exit 0;;
                esac
            done
            continue
        fi

        # Jeśli zadanie zakończyło się normalnie
        echo "Serwer zakończył działanie (kod wyjścia: $task_exit_code)"
        printf "Czy chcesz uruchomić serwer ponownie? (y/n): "
        while true; do
            read -n 1 -s choice
            case $choice in
                [YyPp]*) echo ""; break;;
                [NnQq]*) echo ""; echo "Zamykanie skryptu..."; exit 0;;
            esac
        done
    done
}

# Uruchom główną pętlę
#: ------------------------------------------
main_loop
