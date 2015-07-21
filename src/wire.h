#ifndef WIRE_H__
#define WIRE_H__

#include <list>
#include <functional>

template<typename T, typename... Args>
class WireBaseEmitter {
    public:
        typedef std::function<T(Args...)> Listener;
        typedef typename std::list<Listener>::iterator ListenerId;

    protected:
        std::list<Listener> listeners;
        bool propagate;

    public:
        ListenerId AppendListener(Listener l) {
            listeners.push_back(std::move(l));
            return --listeners.end();
        }

        ListenerId PrependListener(Listener l) {
            listeners.push_front(std::move(l));
            return listeners.begin();
        }

        void RemoveListener(ListenerId l) {
            listeners.erase(l);
        }

        size_t CountListeners() const {
            return listeners.size();
        }

        void StopPropagation() {
            propagate = false;
        }

        void Emit(Args... args) {
            propagate = true;
            for (auto l : listeners) {
                l(args...);
                if (!propagate)
                    break;
            }
        }
};

template<typename T, typename...Args>
class WireEmitter: public WireBaseEmitter<T, Args...> {
    public:
        std::list<T> Collect(Args... args) {
            std::list<T> results;
            WireBaseEmitter<T, Args...>::propagate = true;
            for (auto l : WireBaseEmitter<T, Args...>::listeners) {
                results.push_back(l(args...));
                if (!WireBaseEmitter<T, Args...>::propagate)
                    break;
            }
            return results;
        }
};

template<typename T, typename... Args>
class Wire: public WireEmitter<T, Args...> {};

template<typename... Args>
class Wire<void, Args...>: public WireBaseEmitter<void, Args...> {};


#endif//WIRE_H__
