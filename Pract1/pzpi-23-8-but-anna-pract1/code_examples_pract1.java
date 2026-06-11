package org.example;

public class Main {

    // Базовий інтерфейс замовлення
    public interface Order {
        String getDescription();
        double getCost();
    }

    // Конкретна реалізація базового замовлення
    public static class BasicOrder implements Order {

        @Override
        public String getDescription() {
            return "Базове замовлення";
        }

        @Override
        public double getCost() {
            return 100.0;
        }
    }

    // Абстрактний декоратор, що містить посилання на об'єкт Order
    public static abstract class OrderDecorator implements Order {

        protected Order decoratedOrder;

        public OrderDecorator(Order order) {
            this.decoratedOrder = order;
        }

        @Override
        public String getDescription() {
            return decoratedOrder.getDescription();
        }

        @Override
        public double getCost() {
            return decoratedOrder.getCost();
        }
    }

    // Декоратор для додавання подарункового пакування
    public static class GiftWrapDecorator extends OrderDecorator {

        public GiftWrapDecorator(Order order) {
            super(order);
        }

        @Override
        public String getDescription() {
            return super.getDescription()
                    + " + подарункове пакування";
        }

        @Override
        public double getCost() {
            return super.getCost() + 20.0;
        }
    }

    // Декоратор для додавання експрес-доставки
    public static class ExpressDeliveryDecorator
            extends OrderDecorator {

        public ExpressDeliveryDecorator(Order order) {
            super(order);
        }

        @Override
        public String getDescription() {
            return super.getDescription()
                    + " + експрес-доставка";
        }

        @Override
        public double getCost() {
            return super.getCost() + 50.0;
        }
    }

    // Декоратор для додавання страхування замовлення
    public static class InsuranceDecorator
            extends OrderDecorator {

        public InsuranceDecorator(Order order) {
            super(order);
        }

        @Override
        public String getDescription() {
            return super.getDescription()
                    + " + страхування";
        }

        @Override
        public double getCost() {
            return super.getCost() + 30.0;
        }
    }

    public static void main(String[] args) {

        // Створення базового замовлення
        Order order = new BasicOrder();

        // Послідовне обгортання замовлення декораторами
        order = new GiftWrapDecorator(order);
        order = new ExpressDeliveryDecorator(order);
        order = new InsuranceDecorator(order);

        // Виведення підсумкової інформації про замовлення
        System.out.println(
                "Опис: " + order.getDescription());

        System.out.println(
                "Загальна вартість: "
                        + order.getCost());
    }
}


/* Запити до ШІ (модель GPT-5.3, OpenAI):
- опишіть типову практичну ситуацію, у якій доцільно використовувати шаблон проєктування «Декоратор».
  Поясніть, яку проблему він вирішує, чому альтернативні підходи є менш ефективними,
  та які переваги його застосування;
- розробіть приклад програмної реалізації шаблону «Декоратор» мовою Java для певної
  інформаційної системи (наприклад, системи обробки замовлень, повідомлень);
- поясніть, яким чином шаблон «Декоратор» застосовано у наведеному прикладі коду;
- проаналізуйте взаємодію між компонентами (інтерфейсом, декораторами та конкретними реалізаціями). */
