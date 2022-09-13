(function ($) {

    function number_format(number, decimals, dec_point, thousands_point) {
        if (number == null || !isFinite(number)) {
            throw new TypeError("number is not valid");
        }

        if (!decimals) {
            let len = number.toString().split('.').length;
            decimals = len > 1 ? len : 0;
        }

        if (!dec_point) {
            dec_point = '.';
        }

        if (!thousands_point) {
            thousands_point = ',';
        }

        number = parseFloat(number).toFixed(decimals);

        number = number.replace(".", dec_point);

        let splitNum = number.split(dec_point);
        splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_point);
        number = splitNum.join(dec_point);

        return number;
    }


    function cart_behaviors() {


        $('[data-cart-block]')
            .once()
            .on('updateTotal', function () {
                let $this = $(this);

                let total = 0;
                let list = [];

                $this.find('.secrow2').each(function () {
                    let item = $(this).find('[data-count]');
                    let name = $(this).find('h3').text().replace(/\s{2,}/g, ' ');

                    let price = parseInt(item.attr('data-price'));
                    let count = parseInt(item.find('[data-value]').attr('data-value'));

                    total += price * count;

                    if (count > 0) {
                        list.push(name + ', ' + count + ' шт.');
                    }
                });

                $this.find('[data-total-value]').text(
                    number_format(total, 0, ', ', ' ')
                );

                (total > 0) ? $this.addClass('has') : $this.removeClass('has');

                $('[data-cart-input]').val(list.join("\n"));
            });

        $('[data-cart-block] [data-add]')
            .once()
            .click(function (e) {
                e.preventDefault();

                let $this = $(this);
                let wrapper = $this.closest('[data-count]');

                wrapper.trigger('updateCount', [1]);
            });


        $('[data-cart-block] [data-count]')
            .once()
            .on('state', function () {
                let $this = $(this);
                let count = parseInt($this.find('[data-value]').attr('data-value'));

                (count === 0) ? $this.removeClass('has') : $this.addClass('has');
            })
            .on('updateCount', function (e, count) {
                let $this = $(this);

                $this
                    .find('[data-value]')
                    .attr('data-value', count)
                    .text(number_format(count, 0, ', ', ' '));

                $this.trigger('state');

                $this.closest('[data-cart-block]').trigger('updateTotal');
            })
            .find('[data-plus], [data-minus]')
            .once()
            .click(function (e) {
                e.preventDefault();

                let $this = $(this);
                let wrapper = $this.closest('[data-count]');
                let count = parseInt(wrapper.find('[data-value]').attr('data-value'));

                if ($this.is('[data-minus]')) {
                    count--;
                } else {
                    count++;
                }

                $this.trigger('updateCount', [count]);
            });

    }


    $(document).ready(function () {
        cart_behaviors();
    });


    $(document).ajaxComplete(function () {
        cart_behaviors();
    });

})(jQuery);